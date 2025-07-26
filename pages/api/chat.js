export default async function handler(req, res) {
  try {
    const { messages } = req.body;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
      }),
    });

    if (!openaiRes.ok) {
      const errorData = await openaiRes.json();
      console.error("OpenAI API error:", errorData);
      return res.status(openaiRes.status).json({
        error: "OpenAI API request failed",
        details: errorData,
      });
    }

    const data = await openaiRes.json();
    res.status(200).json({ result: data.choices[0].message.content });
  } catch (err) {
    console.error("Handler error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
