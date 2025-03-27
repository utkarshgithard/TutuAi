import express from 'express'
import 'dotenv/config'
import ChatModel from '../Models/chatModal.js';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { uniqueId } from '../util.js';
import authUser from '../middlewares/auth.js';


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
            { $group: { _id: "$conversationId", latestMessage: { $last: "$userMessage" } } },
            { $sort: { latestMessage: -1 } }  // Sort by latest message
        ]);
        res.json({ success: true, conversations });
    } catch (error) {
        consoe.log(error);
        res.json({ success: false, message: error.message })
    }
})


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

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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