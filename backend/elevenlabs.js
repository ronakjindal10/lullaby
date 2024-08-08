const { ElevenLabsClient } = require('elevenlabs');
const { createWriteStream } = require('fs');
const { v4: uuid } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

const client = new ElevenLabsClient({
    apiKey: ELEVENLABS_API_KEY,
});

const createAudioFileFromText = async (text) => {
    return new Promise(async (resolve, reject) => {
        try {
            const audio = await client.generate({
                voice: "Rachel",
                model_id: "eleven_turbo_v2_5",
                //model_id: "1qEiC6qsybMkmnNdVMbK",
                text,
            });
            const fileName = `${uuid()}.mp3`;
            const fileStream = createWriteStream(fileName);

            audio.pipe(fileStream);
            fileStream.on("finish", () => resolve(fileName)); // Resolve with the fileName
            console.log("Audio file generated: ", fileName);
            fileStream.on("error", reject);
        } catch (error) {
            console.log("Error generating audio: ", error);
            reject(error);
        }
    });
};

module.exports = { createAudioFileFromText };