export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Only POST requests allowed' }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'API route is working' }),
  }
}
