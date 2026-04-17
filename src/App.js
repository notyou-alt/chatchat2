// App.js
import { useState } from "react";
import axios from "axios";
import Admin from "./admin";
import "./app.css";
import API_BASE_URL from "./config/api";

import happy from "./assets/happy.webp";
import neutral from "./assets/neutral.webp";
import serious from "./assets/serious.webp";
import cheerful from "./assets/cheerful.webp";
import shy from "./assets/shy.webp";
import angry from "./assets/angry.webp";
import thinking from "./assets/thinking.webp";
import greeting from "./assets/greeting.webp";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [score, setScore] = useState(0);
  const [emotion, setEmotion] = useState("neutral");
  const [isThinking, setIsThinking] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const emotionMap = { happy, neutral, serious, cheerful, shy, angry, greeting };

  const sendMessage = async () => {
    if (!message.trim() || isThinking) return;

    setIsThinking(true);
    const startTime = Date.now();

    try {
      const res = await axios.post(`${API_BASE_URL}/chat`, {
        message,
      });

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1000 - elapsed);
      
      // Minimal 1 detik tampilkan mode berpikir
      setTimeout(() => {
        setResponse(res.data.response);
        setScore(res.data.score);
        setEmotion(res.data.emotion);
        setMessage("");
        setIsThinking(false);
      }, remaining);

    } catch (err) {
      console.error(err);
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1000 - elapsed);
      
      setTimeout(() => {
        setResponse("Terjadi kesalahan. Silakan coba lagi.");
        setScore(0);
        setEmotion("neutral");
        setIsThinking(false);
      }, remaining);
    }
  };

  const handleLogin = () => {
    if (password === "12345678") setIsAuthenticated(true);
    else alert("Password salah!");
  };

  const isAdminPage = window.location.pathname === "/admin";

  if (isAdminPage) {
    if (!isAuthenticated) {
      return (
        <div className="app-container">
          <div className="app-box">
            <h2>Admin Access</h2>
            <input
              type="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br /><br />
            <button className="btn-success" onClick={handleLogin}>
              Masuk
            </button>
          </div>
        </div>
      );
    }

    return <Admin />;
  }

  const currentMascot = isThinking ? thinking : emotionMap[emotion];
  const altText = isThinking ? "Maskot sedang berpikir" : `Emoji wajah dengan ekspresi ${emotion}`;

  return (
    <div className="app-container">
      <div className="app-box">

        <h1>Chatbot Mentoring</h1>

        <button className="adminButton" onClick={() => (window.location.href = "/admin")}>
          Open The Core
        </button>

        <img 
          className="maskot" 
          src={currentMascot} 
          alt={altText}
        />

        <div className="input-row">
          {!isThinking ? (
            <>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tanya sesuatu..."
              />
              <button className="btn-success" onClick={sendMessage}>
                Tanya
              </button>
            </>
          ) : (
            <div className="loading-bar-container">
              <div className="loading-bar"></div>
              <div className="loading-text">Chatbot sedang berpikir...</div>
            </div>
          )}
        </div>

        <div className="response-box fade-in">
          <h3>Jawaban</h3>
          <p>{response}</p>

          <h4>Score: {score}</h4>
        </div>

      </div>
    </div>
  );
}

export default App;