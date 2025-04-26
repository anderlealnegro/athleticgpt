const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Aseguramos que el 'prompt' se está recibiendo bien
  const { prompt } = JSON.parse(event.body || '{}');

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No prompt provided.' }),
    };
  }

  try {
    // Llamada a la API de OpenAI para generar la respuesta
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un aficionado del Athletic Club. Responde siempre con pasión rojiblanca, hablando como un hincha entusiasta.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    // Verificamos si la respuesta fue exitosa y procesamos el mensaje
    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: data.choices[0].message.content })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'No valid response from OpenAI.' })
      };
    }
  } catch (error) {
    console.error('Error al generar la respuesta:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error generating response.' })
    };
  }
};
