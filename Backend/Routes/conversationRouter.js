import express from "express";
import ChatModel from "../Models/chatModal.js";
const conversationRouter = express.Router();

conversationRouter.put("/conversations/:id", async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  try {
    await ChatModel.updateMany(
      { conversationId: id },  // ✅ Update all messages under this conversation
      { topicName: newName }
    );
    const updatedConversation = await ChatModel.find({ conversationId: id });

    if (updatedConversation.modifiedCount === 0) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(updatedConversation);
  } catch (error) {
    res.status(500).json({ message: "Error updating conversation name" });
  }
});

export default conversationRouter;