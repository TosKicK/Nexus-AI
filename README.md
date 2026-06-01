# Nexus AI 🚀

Nexus AI is a full-stack AI-powered assistant that combines conversational AI, document understanding, and coding assistance in a single platform.

Users can upload documents, ask questions about their content, receive AI-generated responses, switch between research and coding modes, and maintain local chat history for a seamless experience.

---

## 🌟 Features

### 🤖 AI Chat Assistant

* General-purpose conversational AI.
* Powered by OpenRouter LLMs.
* Context-aware responses.

### 🔬 Research Mode

* Upload documents and ask questions about them.
* Uses Retrieval-Augmented Generation (RAG).
* Answers are generated using relevant document context.

### 💻 Coding Mode

* Specialized coding assistant.
* Generates optimized solutions.
* Explains algorithms and data structures.
* Provides complexity analysis and code snippets.

### 📄 Multi-Document Support

Supports:

* PDF (.pdf)
* Word Documents (.docx)
* Text Files (.txt)

### 🧠 Semantic Search

* Document chunking.
* Vector embeddings using Hugging Face Transformers.
* Similarity search with LangChain Memory Vector Store.

### 💬 Chat History

* Local chat history using browser localStorage.
* Start new chats anytime.
* Switch between conversations.

### 🎨 Modern User Interface

* Responsive React frontend.
* Markdown rendering for AI responses.
* Clean ChatGPT-inspired design.

---

## 🏗️ Architecture

Document Upload
↓
Text Extraction
↓
Chunking
↓
Embeddings Generation
↓
Vector Store
↓
Similarity Search
↓
Relevant Context Retrieval
↓
Large Language Model
↓
Response Generation

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* React Markdown
* CSS

### Backend

* Node.js
* Express.js
* Multer
* PDF.js
* Mammoth

### AI & NLP

* OpenRouter API
* LangChain
* Hugging Face Transformers
* Memory Vector Store

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## 📂 Project Structure

Nexus-AI/

├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/TosKicK/Nexus-AI.git
cd Nexus-AI
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
OPENROUTER_API_KEY=YOUR_API_KEY
```

Start backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🚀 Usage

### Research Mode

1. Upload a PDF, DOCX, or TXT file.
2. Switch to Research Mode.
3. Ask questions about the document.
4. Receive AI-generated answers based on document content.

### Coding Mode

1. Switch to Coding Mode.
2. Ask programming questions.
3. Receive structured explanations and code solutions.

---

## 📸 Screenshots

Add screenshots here:

* Home Page
* Research Mode
* Coding Mode
* Document Upload
* Chat History

---

## 🔮 Future Enhancements

* Image Upload Support
* OCR Integration
* Source Citations
* Export Chats to PDF
* Advanced Document Search
* Multiple Document Collections

---

## 📌 Key Highlights

✔ Retrieval-Augmented Generation (RAG)

✔ Semantic Search using Vector Embeddings

✔ Multi-Format Document Processing

✔ Coding Assistant

✔ Research Assistant

✔ Chat History Support

✔ Full-Stack Deployment

---

## 👨‍💻 Author

Abhiroop Banerjee

GitHub: https://github.com/TosKicK

---

## 📄 License

This project is licensed under the MIT License.
