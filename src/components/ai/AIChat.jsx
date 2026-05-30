import { useState } from "react";
import { askAI } from "../../services/aiService";
import "./AIChat.css";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: input }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const reply = await askAI(newMessages);

    setMessages([
      ...newMessages,
      { role: "assistant", content: reply }
    ]);

    setLoading(false);
  };

  return (
    <div className="ai-chat">

      <div className="ai-header">
        <h2>ProdAI Assistant</h2>
        <p>Tu tutor inteligente</p>
      </div>

      <div className="ai-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`msg ${m.role}`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="msg ai">Pensando...</div>
        )}
      </div>

      <div className="ai-input-box">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta a ProdAI..."
        />

        <button onClick={sendMessage}>
          Enviar
        </button>
      </div>

    </div>
  );
}