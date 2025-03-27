import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize context for storing conversation state
let conversationContext = [];

export const askGemini = async (userMessage) => {
  try {
    // Add user message to context
    conversationContext.push({ role: 'user', content: userMessage });

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: conversationContext,
      },
      {
        headers: {
          Authorization: `Bearer ${GEMINI_API_KEY}`,
        },
      }
    );

    const botMessage = response.data.candidates[0].content.parts[0].text;

    // Add bot response to context
    conversationContext.push({ role: 'bot', content: botMessage });

    return botMessage;
  } catch (error) {
    console.error('Error communicating with Gemini:', error);
    return 'Something went wrong, please try again.';
  }
};

// Optional: Reset conversation if required
export const resetContext = () => {
  conversationContext = [];
};
