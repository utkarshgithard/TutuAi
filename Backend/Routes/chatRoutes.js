import express from 'express'
import 'dotenv/config'
import ChatModel from '../Models/chatModal.js';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { uniqueId } from '../util.js';
import authUser from '../middlewares/auth.js';
import userModel from '../Models/userModal.js';
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


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ChatRouter = express.Router()

ChatRouter.delete('/deleteConversation/:conversationId', async (req, res) => {

    try {
        const { conversationId } = req.params;

        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID Required." })
        }

        await ChatModel.deleteMany({ conversationId })
        res.json({ message: "Conversation deleted Successfully." })

    } catch (error) {
        console.log(error)
        res.json({ error: "Server Error" })
    }
})

ChatRouter.get('/getUserHistory', authUser, async (req, res) => {
    const { userId } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ error: "UserId required" });
        }
        const conversations = await ChatModel.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: "$conversationId",
                    topicName: { $first: "$topicName" }, // 🟡 Pick the topicName from one of the messages
                    createdAt: { $first: "$createdAt" },  // Optional: sort by created time
                }
            },
            { $sort: { createdAt: -1 } } // Newest conversations first
        ]);
        const user = await userModel.findById(userId)
        res.json({ success: true, conversations,name:user.name });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
})
// i am adding a new route to my backend to generate response.
ChatRouter.post('/resource', authUser, async (req, res) => {
    try {
        const { userId, chatHistory } = req.body;
        if (!chatHistory || chatHistory.length === 0) {
            return res.status(400).json({ error: "Chat history is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `You are an AI study assistant helping students understand topics deeply and quickly.
        I want you to generate resources from the web, which can include youtube video links, valuable articles or wiikipedia results or images links after analysing:
        ${chatHistory.map(chat => `${chat.role === 'user' ? `User:${chat.content}` : `Bot:${chat.content}`}`).join("\n")} your response should be according to the level of understanding of the user.
        Format the response as JSON:
        {
        "resources": [
            {
                "title": "...",
                "description ": "...",
                "link": "..."
            }
        ]
        }
        Based on the following conversation history, generate a resource with simple explaination, real world example .
        Each resource should be working so that links are clickable. I only want json data nothing else with the resposne.
`;




        const response = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
        console.log('hi')
        console.log(response.response.candidates[0].content.parts[0].text)
        const resourceData = extractJSON(response.response.candidates[0].content.parts[0].text)

        console.log(resourceData)
        res.json(resourceData);
    } catch (error) {
        console.error("Error generating resources:", error);
        res.status(500).json({ error: "Unable to found relevant resources." });
    }
});
ChatRouter.post('/chat', authUser, async (req, res) => {


    try {
        let { message, chatHistory, userId, conversationId } = req.body;
        console.log(conversationId)

        if (!message || !userId) {
            return res.status(400).json({ error: "Message and userId are required" });
        }

        // If conversationId is not provided, create a new one
        if (!conversationId) {
            conversationId = uniqueId();
        }

        // Fetch past messages from the same conversation
        const pastChats = await ChatModel.find({ userId, conversationId }).sort({ timestamp: 1 });
        const conversation = pastChats.map(chat => ({ role: "user", content: chat.userMessage }));
        conversation.push({ role: "user", content: message });

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        // Prepare conversation with context
        const limitedContext = pastChats.slice(-5).map(chat => ({
            role: "user",
            parts: [{ text: chat.userMessage }]
        }));

        // Prepend instruction to the user message
        const instruction = "Note: Only respond to the latest message without repeating previous responses.";
        const userMessage = { role: "user", parts: [{ text: `${instruction}\n\n${message}` }] };

        limitedContext.push(userMessage);
        const response = await model.generateContent({ contents: limitedContext  });
        const botReply = response.response.candidates[0].content.parts[0].text;



        // // Save chat to MongoDB
        // await Chat.create({ userMessage: message, botResponse: botReply });

        await ChatModel.create({ userMessage: message, botResponse: botReply, userId, conversationId });

        const updatedHistory = await ChatModel.find({ userId, conversationId }).sort({ timestamp: 1 });
        res.json({
            response: botReply,
            conversationId,
            chatHistory: updatedHistory,  // ✅ Return updated chat history from DB
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});
// History of Conversation                  
ChatRouter.post("/conversation-history", authUser, async (req, res) => {
    try {
        let { userId } = req.body;
        console.log(userId)
        let { conversationId } = req.body;
        console.log(conversationId)
        if (!userId || !conversationId) {
            return res.status(400).json({ error: "UserId and conversationId are required" });
        }

        const history = await ChatModel.find({ userId, conversationId }).sort({ timestamp: 1 });
        res.json(history);
    } catch (error) {
        console.error("Error fetching conversation history:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Route to clear a specific conversation
ChatRouter.delete("/clear-conversation", authUser, async (req, res) => {
    try {
        const { userId } = req.body;
        const { conversationId } = req.data;

        if (!userId) {
            return res.status(400).json({ error: "UserId required" });
        }
        if (!userId || !conversationId) {
            return res.status(400).json({ error: "UserId and conversationId are required" });
        }

        await ChatModel.deleteMany({ userId, conversationId });
        res.json({ message: "Conversation cleared successfully" });
    } catch (error) {
        console.error("Error clearing conversation:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

export default ChatRouter