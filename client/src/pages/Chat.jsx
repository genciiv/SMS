import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../lib/api";

const socket = io("http://localhost:5000");

export default function Chat() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [receiverId, setReceiverId] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    socket.emit("join", user._id);

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, []);

  async function loadMessages() {
    if (!receiverId) return;
    try {
      const { data } = await api.get(`/chat?withUser=${receiverId}`);
      setMessages(data);
    } catch (e) {
      setErr("Gabim gjatë marrjes së mesazheve.");
    }
  }

  async function send() {
    if (!text.trim()) return;
    const msg = { senderId: user._id, receiverId, text };
    socket.emit("message", msg);
    setMessages((prev) => [...prev, msg]);
    setText("");
    try {
      await api.post("/chat", { receiverId, text });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="page">
      <h1>💬 Chat</h1>

      <div className="card">
        <label>ID e përdoruesit për të biseduar:</label>
        <input
          className="form__input"
          placeholder="Vendos ID e marrësit..."
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
        <button className="btn btn--primary" onClick={loadMessages}>Ngarko bisedën</button>
      </div>

      <div className="card">
        <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "8px" }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                textAlign: m.senderId === user._id ? "right" : "left",
                margin: "6px 0",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  background: m.senderId === user._id ? "#4f46e5" : "#e0e7ff",
                  color: m.senderId === user._id ? "white" : "black",
                  padding: "6px 10px",
                  borderRadius: "10px",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <input
            className="form__input"
            placeholder="Shkruaj mesazhin..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn--primary" onClick={send}>Dërgo</button>
        </div>
      </div>

      {err && <div className="form__error">{err}</div>}
    </div>
  );
}
