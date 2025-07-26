import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a flirty, fun, and seductive chatbot for webcam viewers.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with: ${errorText}`);
      }

      const data = await res.json();

      setMessages([...newMessages, { role: 'assistant', content: data.result }]);
    } catch (err) {
      console.error('Error calling chat API:', err.message);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: "Oops! Something went wrong. Try again later." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', maxWidth: 500, margin: 'auto' }}>
      <h2>💋 Cam Model AI Chat</h2>
      <div style={{ height: '50vh', overflowY: 'auto', marginBottom: 10, border: '1px solid #ddd', padding: 10, borderRadius: 5 }}>
        {messages
          .filter(m => m.role !== 'system')
          .map((
