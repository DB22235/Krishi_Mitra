// server/routes/chat.js
import express from "express";
import Chat from "../models/Chat.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


/* ── SAVE a chat session ────────────────────────────────────── */
router.post("/save", async (req, res) => {
  try {
    const { userId = null, sessionName = null, messages = [] } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "messages array is required and cannot be empty" });
    }

    const chat = await Chat.create({ userId, sessionName, messages });
    return res.status(201).json({ ok: true, chat });
  } catch (err) {
    console.error("Save chat error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


/* ── GET a single chat by ID ────────────────────────────────── */
router.get("/session/:id", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ message: "Chat session not found" });
    return res.json({ chat });
  } catch (err) {
    console.error("Get chat error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


/* ── LIST chats by userId ───────────────────────────────────── */
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(50, parseInt(req.query.limit || "20", 10));
    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("-messages"); // return summary only (no full messages) for list view

    return res.json({ chats });
  } catch (err) {
    console.error("List chats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


/* ── DELETE a chat by ID ────────────────────────────────────── */
router.delete("/session/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Chat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Chat session not found" });
    return res.json({ ok: true, message: "Chat deleted" });
  } catch (err) {
    console.error("Delete chat error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;