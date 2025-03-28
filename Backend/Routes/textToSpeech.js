import express from 'express';
import path, { dirname } from 'path';
import fs from 'fs';
import util from 'util';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new TextToSpeechClient();
const router = express.Router();

// Serve static audio files
router.use('/audio', express.static(path.join(__dirname, '../output')));

router.post('/convert', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const request = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);

    const fileName = `audio_${Date.now()}.mp3`;
    console.log(dirname)
    const filePath = path.join(__dirname, '../output', fileName);

    await writeFile(filePath, response.audioContent, 'binary');
    console.log(filePath)

    // Send audio URL
    res.status(200).json({ 
      message: 'Audio generated successfully', 
      audio: `http://localhost:5000/audio/${fileName}` 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to convert text to speech' });
  }
});

export default router;

