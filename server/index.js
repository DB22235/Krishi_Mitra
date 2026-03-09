// server/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";
import chatRoutes from "./routes/chat.js";

import connectDB from "./config/db.js";         // config/db.js (above)
import authRoutes from "./routes/auth.js";      // assume you have this (ESM)
import ChatModel from "./models/Chat.js";       // optional: to store chat history

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));

// Connect to DB
connectDB();

// Mount auth routes (if present)
try {
  app.use("/api/auth", authRoutes);
} catch (err) {
  console.warn("Auth routes not mounted. Ensure ./routes/auth.js exists.");
}
  app.use("/api/chat", chatRoutes);
// Healthcheck
app.get("/api/health", (req, res) => res.json({ ok: true, server: "running" }));

// Chat endpoint: forwards to Groq + optional chat storage
app.post("/chat", async (req, res) => {
  try {
    const { messages, save = true, userId = null, sessionName = null } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request. messages (array) required." });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server misconfiguration: missing GROQ_API_KEY" });
    }

    // Optional: save incoming messages to DB before sending to LLM
    let chatDoc = null;
    if (save) {
      try {
        chatDoc = await ChatModel.create({
          userId,
          sessionName,
          messages: messages.map(m => ({ role: m.role || "user", content: m.content || m })),
        });
      } catch (err) {
        console.warn("Could not save incoming chat to DB:", err.message || err);
      }
    }

    // Forward to Groq
    const groqResp = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
        messages,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    const aiData = groqResp.data;

    // Optional: save assistant response into the same chat doc
    if (save && chatDoc) {
      try {
        const assistantContent = aiData?.choices?.[0]?.message?.content;
        if (assistantContent) {
          chatDoc.messages.push({ role: "assistant", content: assistantContent });
          await chatDoc.save();
        }
      } catch (err) {
        console.warn("Could not append assistant response to chat doc:", err.message || err);
      }
    }

    return res.json(aiData);
  } catch (error) {
    if (error.response) {
      console.error("Groq API error:", error.response.status, error.response.data);
      return res.status(502).json({ error: "AI provider error", details: error.response.data });
    } else if (error.request) {
      console.error("Groq request error:", error.message);
      return res.status(502).json({ error: "AI provider not responding", details: error.message });
    } else {
      console.error("Chat handler error:", error.message);
      return res.status(500).json({ error: "AI failed", details: error.message });
    }
  }
});

// Fallback 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// global error listeners
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});