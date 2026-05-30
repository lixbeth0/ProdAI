import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { askAI } from "../../services/aiService";

import "./AIChat.css";

export default function AIChat() {

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `
# 🤖 Bienvenido a ProdAI

Puedo ayudarte a:

- organizar tareas 📅
- explicarte temas 🧠
- investigar 📚
- resolver dudas ⚡
- ayudarte a estudiar 🚀

---

## ✨ Ejemplos

- "¿Cómo empiezo mi tarea?"
- "Tengo 5 tareas hoy"
- "Explícame redes"
- "Ayúdame con matemáticas"
`
    }
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  /* =========================================
     ENVIAR MENSAJE
  ========================================= */

  const sendMessage = async () => {

    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      {
        role: "user",
        content: input
      }
    ];

    setMessages(newMessages);

    const currentInput = input;

    setInput("");

    setLoading(true);

    try {

      const reply = await askAI(newMessages);

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: reply
        }
      ]);

    } catch (error) {

      console.error(error);

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: `
# ❌ Error

No pude generar una respuesta.

Intenta nuevamente.
`
        }
      ]);

    } finally {

      setLoading(false);

    }
  };

  /* =========================================
     ENTER PARA ENVIAR
  ========================================= */

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      sendMessage();

    }
  };

  /* =========================================
     UI
  ========================================= */

  return (

    <div className="ai-chat">

      {/* HEADER */}

      <div className="ai-header">

        <div>

          <h2>ProdAI Assistant</h2>

          <p>
            Tu tutor inteligente
          </p>

        </div>

        <div className="ai-status">
          ● Online
        </div>

      </div>

      {/* MENSAJES */}

      <div className="ai-messages">

        {messages.map((m, i) => (

          <div
            key={i}
            className={`msg ${m.role}`}
          >

            <ReactMarkdown>
              {m.content}
            </ReactMarkdown>

          </div>

        ))}

        {loading && (

          <div className="msg assistant">

            <div className="typing">

              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>

        )}

      </div>

      {/* INPUT */}

      <div className="ai-input-box">

        <textarea
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Pregunta a ProdAI..."
        />

        <button
          onClick={sendMessage}
          disabled={loading}
        >
          Enviar
        </button>

      </div>

    </div>
  );
}