import express from "express";
import FarmerProfile from "../models/FarmerProfile.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All profile routes require a valid JWT
router.use(authMiddleware);

/* ────────────────────────────────────────────────────────────────
   GET /api/profile/me
──────────────────────────────────────────────────────────────── */
router.get("/me", async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res
        .status(404)
        .json({ exists: false, message: "Profile not found" });
    }
    return res.json({ exists: true, profile });
  } catch (err) {
    console.error("GET /me error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ────────────────────────────────────────────────────────────────
   POST /api/profile/save
──────────────────────────────────────────────────────────────── */
router.post("/save", async (req, res) => {
  try {
    const {
      name,
      mobile,
      age,
      gender,
      state,
      district,
      village,
      profileImage,
      caste,
      category,
      annualIncome,
      incomeSource,
      bankName,
      bankAccount,
      ifscCode,
      pmKisanStatus,
      landSize,
      landUnit,
      landOwnership,
      soilType,
      livestock,
      selectedCrops,
      selectedSeasons,
      irrigation,
      aadhaar,
      aadhaarVerified,
      documents,
      memberSince,
    } = req.body;

    // Build update object — only include fields actually sent
    const updateFields = {};

    // Personal
    if (name !== undefined) updateFields.name = name;
    if (mobile !== undefined) updateFields.mobile = mobile;
    if (age !== undefined) updateFields.age = age;
    if (gender !== undefined) updateFields.gender = gender;
    if (state !== undefined) updateFields.state = state;
    if (district !== undefined) updateFields.district = district;
    if (village !== undefined) updateFields.village = village;

    // Profile image
    if (profileImage !== undefined) {
      if (
        profileImage !== null &&
        !profileImage.startsWith("data:image/") &&
        !profileImage.startsWith("http")
      ) {
        return res
          .status(400)
          .json({
            message: "profileImage must be a base64 data URL or http URL",
          });
      }
      updateFields.profileImage = profileImage;
    }

    // Caste / Category
    if (caste !== undefined) updateFields.caste = caste;
    if (category !== undefined) updateFields.category = category;

    // Financial
    if (annualIncome !== undefined) updateFields.annualIncome = annualIncome;
    if (incomeSource !== undefined) updateFields.incomeSource = incomeSource;
    if (bankName !== undefined) updateFields.bankName = bankName;
    if (bankAccount !== undefined) updateFields.bankAccount = bankAccount;
    if (ifscCode !== undefined) updateFields.ifscCode = ifscCode;
    if (pmKisanStatus !== undefined) updateFields.pmKisanStatus = pmKisanStatus;

    // Farm
    if (landSize !== undefined) updateFields.landSize = landSize;
    if (landUnit !== undefined) updateFields.landUnit = landUnit;
    if (landOwnership !== undefined) updateFields.landOwnership = landOwnership;
    if (soilType !== undefined) updateFields.soilType = soilType;
    if (livestock !== undefined) updateFields.livestock = livestock;

    // Crops / Seasons / Irrigation
    if (selectedCrops !== undefined) updateFields.selectedCrops = selectedCrops;
    if (selectedSeasons !== undefined)
      updateFields.selectedSeasons = selectedSeasons;
    if (irrigation !== undefined) updateFields.irrigation = irrigation;

    // Aadhaar
    if (aadhaar !== undefined) {
      if (aadhaar === null) {
        updateFields.aadhaar = null;
      } else {
        const cleaned = String(aadhaar).replace(/\D/g, "");
        if (cleaned.length !== 12) {
          return res
            .status(400)
            .json({ message: "Aadhaar must be exactly 12 digits" });
        }
        updateFields.aadhaar = cleaned;
      }
    }
    if (aadhaarVerified !== undefined) {
      updateFields.aadhaarVerified = Boolean(aadhaarVerified);
    }

    // Documents map — merge using dot notation
    if (documents !== undefined && typeof documents === "object") {
      for (const [docId, fileData] of Object.entries(documents)) {
        updateFields[`documents.${docId}`] = fileData;
      }
    }

    // Meta
    if (memberSince !== undefined) updateFields.memberSince = memberSince;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields provided to save" });
    }

    const profile = await FarmerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateFields },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );
    
    // Sync basic info back to User model if updated
    if (name || mobile) {
      try {
        const userUpdate = {};
        if (name) userUpdate.name = name;
        if (mobile) userUpdate.mobile = mobile;
        
        await User.findByIdAndUpdate(req.user.id, { $set: userUpdate });
        console.log(`✅ Synced info to User model for ${req.user.id}`);
      } catch (syncErr) {
        console.warn(`⚠️ Could not sync info to User model:`, syncErr.message);
      }
    }

    return res.status(200).json({ ok: true, profile });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ message: "Validation error", errors: messages });
    }
    console.error("POST /save error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ────────────────────────────────────────────────────────────────
   GET /api/profile/completion
──────────────────────────────────────────────────────────────── */
router.get("/completion", async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.json({ completion: 0, filled: 0, total: 16 });
    }

    const checks = [
      !!profile.name,
      !!profile.mobile,
      !!profile.age,
      !!profile.gender,
      !!profile.state,
      !!profile.district,
      !!profile.landOwnership,
      profile.landSize > 0,
      profile.selectedCrops.length > 0,
      profile.irrigation.length > 0,
      !!profile.annualIncome,
      !!profile.bankName,
      !!profile.bankAccount,
      !!profile.ifscCode,
      !!profile.aadhaar,
      !!profile.profileImage,
    ];

    const filled = checks.filter(Boolean).length;
    const completion = Math.round((filled / checks.length) * 100);

    return res.json({ completion, filled, total: checks.length });
  } catch (err) {
    console.error("GET /completion error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ────────────────────────────────────────────────────────────────
   GET /api/profile/:userId
──────────────────────────────────────────────────────────────── */
router.get("/:userId", async (req, res) => {
  try {
    const profile = await FarmerProfile.findOne({
      userId: req.params.userId,
    });
    if (!profile) {
      return res
        .status(404)
        .json({ exists: false, message: "Profile not found" });
    }
    return res.json({ exists: true, profile });
  } catch (err) {
    console.error("GET /:userId error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

/* ────────────────────────────────────────────────────────────────
   DELETE /api/profile/me
──────────────────────────────────────────────────────────────── */
router.delete("/me", async (req, res) => {
  try {
    const deleted = await FarmerProfile.findOneAndDelete({
      userId: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.json({ ok: true, message: "Profile deleted" });
  } catch (err) {
    console.error("DELETE /me error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

console.log("✅ profile routes loaded");
export default router;