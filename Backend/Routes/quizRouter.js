import express from 'express'
import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'
import authUser from '../middlewares/auth.js';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const quizRouter = express.Router()

const extractJSON = (text) => {
    try {
        // Ensure text is a string
        const textStr = String(text);

        // Use regex to extract JSON content
        const match = textStr.match(/\{[\s\S]*\}/);

        if (match) {
            const jsonString = match[0]; // Extract JSON string
            return JSON.parse(jsonString); // Convert to JavaScript object
        } else {
            throw new Error("No valid JSON found in response.");
        }
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
};

quizRouter.post('/generate-quiz', authUser, async (req, res) => {
    try {
        const { userId, chatHistory } = req.body;
        if (!chatHistory || chatHistory.length === 0) {
            return res.status(400).json({ error: "Chat history is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        Ensure questions are relevant to the Conversation History:
    ${chatHistory.map(chat => `${chat.role === 'user' ? `User:${chat.content}` : `Bot:${chat.content}`}`).join("\n")}
    Format the response as JSON:
    {
    "questions": [
        {
            "question": "...",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "..."
        }
    ]
    }
    Based on the following conversation history, generate a quiz with 5 multiple-choice questions.
    Each question should have 4 options and one correct answer. I only want json data nothing else with the resposne.
`;




        const response = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
        console.log('hi')
        console.log(response.response.candidates[0].content.parts[0].text)
        const quizData = extractJSON(response.response.candidates[0].content.parts[0].text)

        console.log(quizData)
        res.json(quizData);
    } catch (error) {
        console.error("Error generating quiz:", error);
        res.status(500).json({ error: "Failed to generate quiz" });
    }
});

export default quizRouter