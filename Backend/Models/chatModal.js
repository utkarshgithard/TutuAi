import mongoose, { model } from 'mongoose'
const ChatSchema = new mongoose.Schema({
    userId:{type:String},
    conversationId:{type:String},
    topicName: { type: String, default: "Untitled Conversation" },
    userMessage: String,
    botResponse: String,
    timestamp: { type: Date, default: Date.now }
});

const ChatModel = new model('chat',ChatSchema)

export default ChatModel;