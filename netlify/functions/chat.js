// netlify/functions/chat.js

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set this in Netlify environment variables
});

const openai = new OpenAIApi(configuration);

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No prompt provided' }),
      };
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini', // or 'gpt-4o' or whichever you have access to
      messages: [
        { role: 'system', content: 'You are a helpful cam model assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const responseText = completion.data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ response: responseText }),
    };
  } catch (error) {
    console.error('OpenAI API error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}
