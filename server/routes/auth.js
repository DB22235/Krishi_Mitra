import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import FarmerProfile from "../models/FarmerProfile.js";
import authMiddleware from "../middleware/authMiddleware.js";

if (!process.env.JWT_SECRET) {
  console.error("❌ CRITICAL: JWT_SECRET is not defined in environment variables.");
}

const router = express.Router();

/* ── SIGNUP ──────────────────────────────────────────────────── */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // Create an initial profile for the new user
    try {
      await FarmerProfile.create({
        userId: user._id,
        name: user.name,
      });
      console.log(`✅ Initial profile created for ${user.email}`);
    } catch (profileError) {
      console.warn(`⚠️ Could not create initial profile for ${user.email}:`, profileError.message);
      // We don't fail the signup if profile creation fails, as it can be upserted later
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(201).json({
      message: "User created",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ── SIGNIN ──────────────────────────────────────────────────── */
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.json({
      message: "Authenticated",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Signin error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ── GET CURRENT USER ────────────────────────────────────────── */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

console.log("✅ auth routes loaded");
export default router;