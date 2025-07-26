// pages/index.js

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((msgs) => [...msgs, { sender: 'user', text: input }]);

    // Call Netlify function
    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();

      // Add AI response to chat
      setMessages((msgs) => [...msgs, { sender: 'ai', text: data.response || data.message }]);
    } catch (error) {
      setMessages((msgs) => [...msgs, { sender: 'ai', text: 'Oops, something went wrong.' }]);
      console.error('API call error:', error);
    }

    setInput('');
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      <h1>Cam Model AI Chat</h1>
      <div
        style={{
          border: '1px solid #ccc',
          padding: 10,
          height: 400,
          overflowY: 'auto',
          marginBottom: 10,
          background: '#f9f9f9',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === 'user' ? 'right' : 'left',
              margin: '8px 0',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: 16,
                background: msg.sender === 'user' ? '#007bff' : '#eee',
                color: msg.sender === 'user' ? '#fff' : '#000',
                maxWidth: '80%',
                wordWrap: 'break-word',
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') sendMessage();
        }}
        style={{ width: '100%', padding: 10, fontSize: 16, boxSizing: 'border-box' }}
      />
      <button
        onClick={sendMessage}
        style={{
          marginTop: 10,
          width: '100%',
          padding: 12,
          fontSize: 16,
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        Send
      </button>
    </div>
  );
}
