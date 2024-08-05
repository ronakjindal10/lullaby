const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors'); // Import cors
const { createAudioFileFromText } = require('./elevenlabs');
const path = require('path');

dotenv.config();

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS
app.use(express.json());

app.post('/api/story', async (req, res) => {
    console.log("Received request with prompt: ", req.body.prompt);
    const { prompt } = req.body;
    const systemPrompt = "Create a max 200 character story for kids with the prompt: ";

    try {
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: systemPrompt + prompt }],
            temperature: 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        console.log("OpenAI response: ", openaiResponse.data);

        //const storyText = openaiResponse.data.choices[0].text;
        const storyText = openaiResponse.data.choices[0].message.content.trim();
        console.log("Generated story text: ", storyText);
        
//         const audioBuffer = await createAudioStreamFromText(storyText);
//         console.log("Generated audio buffer: ", audioBuffer);

//         res.set('Content-Type', 'audio/mpeg');
//         res.send(audioBuffer);
//     } catch (error) {
//         res.status(500).send('Error generating story or audio');
//         console.error("Error generating story or audio: ", error);
//     }
// });
        const audioFileName = await createAudioFileFromText(storyText);

                res.json({ audioFileName });
            } catch (error) {
                console.log("Error generating story or audio: ", error);
                res.status(500).send('Error generating story or audio');
            }
        });

        app.get('/api/audio/:fileName', (req, res) => {
            const fileName = req.params.fileName;
            const filePath = path.join(__dirname, fileName);
            res.sendFile(filePath);
        });

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});