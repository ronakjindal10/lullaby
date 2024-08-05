import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [prompt, setPrompt] = useState('');
    const [audioUrl, setAudioUrl] = useState(null);

    const handleGenerateStory = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/story', { prompt });
            const { audioFileName } = response.data;
            const audioUrl = `http://localhost:3001/api/audio/${audioFileName}`;
            setAudioUrl(audioUrl);
        } catch (error) {
            console.error('Error generating story or audio', error);
        }
    };

    return (
        <div className="App">
            <h1>Story Generator</h1>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What kind of story would you like?"
            />
            <button onClick={handleGenerateStory}>Generate Story</button>
            {audioUrl && (
                <audio controls>
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            )}
        </div>
    );
}

export default App;