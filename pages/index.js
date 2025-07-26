import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

  async function sendMessage() {
    if (!input.trim()) return;
    setChatLog([...chatLog, { sender: "user", text: input }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    if (data.reply) {
      setChatLog((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } else {
      setChatLog((prev) => [...prev, { sender: "bot", text: "Error: No response" }]);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Cam Model AI Chat</h1>
      <div
        style={{
          border: "1px solid #ccc",
          height: 400,
          overflowY: "scroll",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      >
        {chatLog.map((chat, i) => (
          <div
            key={i}
            style={{
              textAlign: chat.sender === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <b>{chat.sender === "user" ? "You" : "AI"}:</b> {chat.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%", padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: "8px 16px", marginLeft: 10 }}>
        Send
      </button>
    </div>
  );
}
