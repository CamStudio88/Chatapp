import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful and flirty cam model assistant." },
        { role: "user", content: message },
      ],
    });

    const responseMessage = completion.data.choices[0].message.content;

    res.status(200).json({ reply: responseMessage });
  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
}
