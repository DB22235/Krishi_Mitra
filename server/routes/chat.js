// server/routes/chat.js
import express from "express";
import Chat from "../models/Chat.js";
// import authMiddleware from "../middleware/authMiddleware.js"; // optional

const router = express.Router();

// Save a chat (messages: [{role, content}, ...])
router.post("/save", /* authMiddleware, */ async (req, res) => {
  try {
    const { userId = null, sessionName = null, messages = [] } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "messages array required" });
    }

    const chat = await Chat.create({
      userId,
      sessionName,
      messages,
    });

    return res.status(201).json({ ok: true, chat });
  } catch (err) {
    console.error("Save chat error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get a chat by id
router.get("/session/:id", /* authMiddleware, */ async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: "Not found" });
    res.json({ chat });
  } catch (err) {
    console.error("Get chat error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// List chats by user
router.get("/user/:userId", /* authMiddleware, */ async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(50, parseInt(req.query.limit || "20", 10));
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 }).limit(limit);
    res.json({ chats });
  } catch (err) {
    console.error("List chats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;