// server/models/Chat.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant", "system"], required: true },
  content: { type: String, required: true },
}, { _id: false });

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional
  sessionName: { type: String, default: null },
  messages: { type: [MessageSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;