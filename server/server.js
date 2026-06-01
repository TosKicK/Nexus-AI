import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import multer from "multer";
import OpenAI from "openai";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { MemoryVectorStore }
from "langchain/vectorstores/memory";

import { HuggingFaceTransformersEmbeddings }
from "@langchain/community/embeddings/hf_transformers";



dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
});

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const embeddings =
  new HuggingFaceTransformersEmbeddings({
    model:
      "Xenova/all-MiniLM-L6-v2",
  });


let vectorStore = null;

app.get("/", (req, res) => {
  res.send("API Running");
});

function chunkText(
  text,
  chunkSize = 500,
  overlap = 100
) {
  const chunks = [];

  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;

    const chunk =
      text.slice(start, end);

    chunks.push(chunk);

    start +=
      chunkSize - overlap;
  }

  return chunks;
}

app.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      const filePath = req.file.path;

      const originalName =
        req.file.originalname.toLowerCase();

      let extractedText = "";

      // PDF
      if (originalName.endsWith(".pdf")) {
        const dataBuffer =
          fs.readFileSync(filePath);

        const uint8Array =
          new Uint8Array(dataBuffer);

        const pdf =
          await pdfjsLib.getDocument(
            uint8Array
          ).promise;

        for (
          let i = 1;
          i <= pdf.numPages;
          i++
        ) {
          const page =
            await pdf.getPage(i);

          const textContent =
            await page.getTextContent();

          const textItems =
            textContent.items
              .map(item => item.str)
              .join(" ");

          extractedText +=
            textItems + "\n";
        }
      }

      // DOCX
      else if (
        originalName.endsWith(".docx")
      ) {
        const result =
          await mammoth.extractRawText({
            path: filePath,
          });

        extractedText =
          result.value;
      }

      else if (
        originalName.endsWith(".txt")
      ) {
        extractedText = 
        fs.readFileSync(
          filePath,
          "utf8"
        );
      }

      else {
        return res.status(400).json({
          error:
            "Only PDF and DOCX files are supported.",
        });
      }

      const chunks =
        chunkText(extractedText);

      vectorStore =
        await MemoryVectorStore.fromTexts(
          chunks,
          [],
          embeddings
        );

      res.json({
        success: true,
        fileName:
          req.file.originalname,
        totalChunks:
          chunks.length,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        error:
          "Document processing failed",
      });
    
     
    }
  }
);


app.post(
  "/chat",
  async (req, res) => {
    try {
      const {
        message,
        mode,
      } = req.body;

      let systemPrompt = "";

      // RESEARCH MODE
      if (mode === "research") {

        let context = "";

        if (vectorStore) {
          const docs =
            await vectorStore.similaritySearch(
              message,
              3
            );

          context = docs
            .map(doc => doc.pageContent)
            .join("\n\n");

          systemPrompt = `
You are an AI research assistant.

Use the provided document context when relevant.

If the context does not contain the answer,
use your own knowledge.

Context:

${context}
`;
        } else {

          systemPrompt = `
You are an AI research assistant.

Answer normally and helpfully.
`;
        }
      }

      // CODING MODE
      else if (mode === "coding") {

        systemPrompt = `
You are an expert software engineer.

Provide:

# Approach

# Time Complexity

# Space Complexity

# Code

IMPORTANT:
- Always wrap code in markdown code blocks.
- Use the correct language tag.
`;
      }

      const completion =
        await openai.chat.completions.create({
          model:
            "meta-llama/llama-3-8b-instruct",

          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: message,
            },
          ],
        });

      const reply =
        completion.choices[0]
          .message.content;

      res.json({
        reply,
        usedDocument:
          vectorStore !== null,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        error:
          "Something went wrong",
      });
    }
  }
);


const PORT = 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});