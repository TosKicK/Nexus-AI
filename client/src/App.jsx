import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import ReactMarkdown from "react-markdown";

function App() {
  const [message, setMessage] = useState("");

  const [mode, setMode] =  useState("research");

  const [chat, setChat] = useState([])

  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const [uploadedFileName, setUploadedFileName] = useState("");

  

const [chatHistory, setChatHistory] = useState(() => {
  const savedChats =
    localStorage.getItem(
      "nexus-chat-history"
    );

  return savedChats
    ? JSON.parse(savedChats)
    : [];
});


useEffect(() => {
  localStorage.setItem(
    "nexus-chat-history",
    JSON.stringify(chatHistory)
    );
}, [chatHistory]);





    useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat,loading]);


const handleNewChat = () => {

  if (chat.length > 0) {

    const newHistoryItem = {
      id: Date.now(),

      title:
        chat.find(
          msg => msg.role === "user"
        )?.text?.slice(0, 30) ||
        "New Chat",

      messages: chat,

      mode,
    };

    setChatHistory(prev => [
      newHistoryItem,
      ...prev,
    ]);
  }

  setChat([]);
  setMessage("");
  setUploadedFileName("");

};


  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {
      const response = await axios.post(
        "https://nexus-ai-1-e76p.onrender.com/chat",
        {
          message: currentMessage,
          mode:mode,
        }
      );

      const botMessage = {
        role: "bot",
        text: response.data.reply,
      };

      setChat((prev) => [...prev, botMessage]);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);

      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Something went wrong.",
        },
      ]);
    }
  };

  return (
    <div className="app">

      {/* SIDEBAR */}

      <div className="sidebar">

        <div className="logo">
          Nexus AI
        </div>

       <button
  className="new-chat-btn"
  onClick={handleNewChat}
>
  + New Chat
</button>



        <div className="sidebar-section">

          <div className="sidebar-title">
            Recent Chats
          </div>

         {chatHistory.map((item) => (

  <div
    key={item.id}
    className="sidebar-item"

    onClick={() => {
      setChat(item.messages);
      setMode(item.mode);
      
    }}
  >
    {item.title}
  </div>

))}

        </div>

      </div>

      {/* MAIN */}

      <div className="main">

        {/* TOPBAR */}

        <div className="topbar">

          <div className="topbar-title">
          Nexus AI Workspace
          </div>

        <div className = "mode-toggle">

          <button 
          className={
            mode === "research"
            ? "active-mode"
            : ""
          }

          onClick={() => {
            handleNewChat();
            setMode("research");
          }}
          >
            Research Mode
          </button>

          <button 
          className={
            mode === "coding"
            ? "active-mode"
            : ""
          }
          onClick={() => {
            handleNewChat();
            setMode("coding");
          }}
          >
            Coding Mode
          </button>
        </div>


        </div>

        {/* CHAT */}

       <div className="chat-container">

  {chat.length === 0 && (
    <div className="welcome-section">

      <h1 className="welcome-title">
        {mode === "research"
          ? "What would you like to research today?"
          : "What coding problem can I help you with today?"}
       
      </h1>

      <p className="welcome-subtitle">
        {mode === "research"
          ? "Upload documents, analyze concepts, and interact with your AI research assistant."
          : "Ask coding questions, debug code, and get help with programming tasks."}
      </p>

      <div className="suggestion-grid">

        <div className="suggestion-card">
          <h3>📄 Summarize Research Papers</h3>

          <p>
            Generate concise summaries from PDFs
            and technical documents.
          </p>
        </div>

        <div className="suggestion-card">
          <h3>🧠 Explain Complex Concepts</h3>

          <p>
            Understand distributed systems,
            AI architectures, and more.
          </p>
        </div>

        <div className="suggestion-card">
          <h3>⚡ Generate Study Notes</h3>

          <p>
            Convert large documents into clean,
            structured notes instantly.
          </p>
        </div>

        <div className="suggestion-card">
          <h3>🔍 Compare Technologies</h3>

          <p>
            Compare frameworks, models,
            databases, and system designs.
          </p>
        </div>

      </div>

    </div>
  )}

{chat.map((msg, index) => (
  <div
    key={index}
    className={`message ${
      msg.role === "user"
        ? "user-message"
        : "bot-message"
    }`}
  >
    {msg.role === "bot" ? (
      <ReactMarkdown>
        {msg.text}
      </ReactMarkdown>
    ) : (
      msg.text
    )}
  </div>
))}


  {loading && (
    <div className = "thinking-container">

      <div className = "thinking-bubble">
        Nexus Ai is thinking...

        <span className="dot">.</span>
        <span className="dot delay-1">.</span>
        <span className="dot delay-2">.</span>
      </div>
    </div>
  )}
  
<div ref={chatEndRef}></div>
</div>
        {/* INPUT */}

        <div className="input-container">

        {uploadedFileName && (
  <div className="upload-status">
    📄 {uploadedFileName}
  </div>
)}

         <div className="input-box">

            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }

              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

<label
  htmlFor="file-upload"
  className="attach-btn"
>
  📎
</label>

<input
  id="file-upload"
  type="file"
  accept=".pdf,.docx,.txt"
  style={{ display: "none" }}
 onChange={async (e) => {
  const file = e.target.files[0];

  if (!file) return;

 
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "https://nexus-ai-1-e76p.onrender.com/upload",
      formData
    );

    setUploadedFileName(
      `${response.data.fileName} (${response.data.totalChunks} chunks)`
    );
  } catch (error) {
    console.log(error);
  }
}}
  
/>

            <button
              className="send-btn"
              onClick={sendMessage}
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;