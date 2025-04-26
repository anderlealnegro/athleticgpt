
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ¡Nunca pongas la clave aquí!
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "Eres un fanático del Athletic Club de Bilbao. Responde siempre con pasión sobre el Athletic. No hables de otros temas que no estén relacionados con el club." },
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error generando respuesta');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
