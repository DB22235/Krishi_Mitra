import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";

// Load .env BEFORE anything else
dotenv.config();

import connectDB from "./config/db.js";
import ChatModel from "./models/Chat.js";

// Import routes — each import will log "✅ xxx routes loaded"
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import profileRoutes from "./routes/profile.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Allowed CORS origins ────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://localhost:5000",
].filter(Boolean);

// ── Body parsers ─────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      console.warn(`CORS blocked request from origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ── Connect to MongoDB ──────────────────────────────────────────
connectDB();

// ── Mount Routes ────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/profile", profileRoutes);

console.log("✅ All route groups mounted on Express app");

// ── Debug: Print all registered routes ──────────────────────────
const printRoutes = (stack, prefix = "") => {
  stack.forEach((layer) => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");
      console.log(`   ${methods} ${prefix}${layer.route.path}`);
    } else if (layer.name === "router" && layer.handle.stack) {
      const match = layer.regexp.source
        .replace("^\\", "")
        .replace("\\/?(?=\\/|$)", "")
        .replace(/\\/g, "");
      printRoutes(layer.handle.stack, prefix + "/" + match);
    }
  });
};

console.log("\n📋 Registered routes:");
printRoutes(app._router.stack);
console.log("");

// ── Healthcheck ─────────────────────────────────────────────────
app.get("/api/health", (req, res) =>
  res.json({
    ok: true,
    server: "running",
    timestamp: new Date().toISOString(),
  })
);

// ── Main AI Chat endpoint ───────────────────────────────────────
app.post("/chat", async (req, res) => {
  try {
    const {
      messages,
      save = true,
      userId = null,
      sessionName = null,
    } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ error: "Invalid request. messages (array) required." });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Server misconfiguration: missing GROQ_API_KEY" });
    }

    // Save incoming messages to DB
    let chatDoc = null;
    if (save) {
      try {
        chatDoc = await ChatModel.create({
          userId,
          sessionName,
          messages: messages.map((m) => ({
            role: m.role || "user",
            content: m.content || m,
          })),
        });
      } catch (err) {
        console.warn(
          "Could not save incoming chat to DB:",
          err.message || err
        );
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

    // Append assistant reply to same chat doc
    if (save && chatDoc) {
      try {
        const assistantContent = aiData?.choices?.[0]?.message?.content;
        if (assistantContent) {
          chatDoc.messages.push({
            role: "assistant",
            content: assistantContent,
          });
          await chatDoc.save();
        }
      } catch (err) {
        console.warn(
          "Could not append assistant response:",
          err.message || err
        );
      }
    }

    return res.json(aiData);
  } catch (error) {
    if (error.response) {
      console.error(
        "Groq API error:",
        error.response.status,
        error.response.data
      );
      return res
        .status(502)
        .json({ error: "AI provider error", details: error.response.data });
    } else if (error.request) {
      console.error("Groq request error:", error.message);
      return res
        .status(502)
        .json({
          error: "AI provider not responding",
          details: error.message,
        });
    } else {
      console.error("Chat handler error:", error.message);
      return res
        .status(500)
        .json({ error: "AI failed", details: error.message });
    }
  }
});

// ── 404 fallback ────────────────────────────────────────────────
app.use((req, res) =>
  res
    .status(404)
    .json({ error: `Route ${req.method} ${req.path} not found` })
);

// ── Global error handler ────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Global error handler:", err.message);
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS: origin not allowed" });
  }
  res.status(500).json({ error: "Internal server error" });
});

// ── Process safety nets ─────────────────────────────────────────
process.on("uncaughtException", (err) =>
  console.error("Uncaught exception", err)
);
process.on("unhandledRejection", (reason) =>
  console.error("Unhandled rejection", reason)
);

// ── Start ───────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Allowed origins:`, allowedOrigins);
  console.log(`\nTest these endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log(`   POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   POST http://localhost:${PORT}/api/auth/signin`);
  console.log(`   GET  http://localhost:${PORT}/api/profile/me`);
  console.log(`   POST http://localhost:${PORT}/api/profile/save`);
  console.log(`   GET  http://localhost:${PORT}/api/profile/completion\n`);
});