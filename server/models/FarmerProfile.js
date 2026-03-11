import mongoose from "mongoose";

const FarmerProfileSchema = new mongoose.Schema(
  {
    // ── Link to User ─────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ── Personal ─────────────────────────────────────────────────
    name: {
      type: String,
      trim: true,
      default: null,
    },
    mobile: {
      type: String,
      trim: true,
      default: null,
    },
    age: {
      type: Number,
      min: 1,
      max: 120,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", null],
      default: null,
    },
    state: {
      type: String,
      trim: true,
      default: null,
    },
    district: {
      type: String,
      trim: true,
      default: null,
    },
    village: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Profile Image ────────────────────────────────────────────
    profileImage: {
      type: String,
      default: null,
    },

    // ── Caste / Category ─────────────────────────────────────────
    caste: {
      type: String,
      enum: ["General", "OBC", "SC", "ST", "Other", null],
      default: null,
    },
    category: {
      type: String,
      enum: ["BPL", "APL", "General", null],
      default: null,
    },

    // ── Financial ────────────────────────────────────────────────
    annualIncome: {
      type: String,
      default: null,
    },
    incomeSource: {
      type: String,
      enum: ["Farming", "Labour", "Business", "Govt Job", "Other", null],
      default: null,
    },
    bankName: {
      type: String,
      trim: true,
      default: null,
    },
    bankAccount: {
      type: String,
      trim: true,
      default: null,
    },
    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
    pmKisanStatus: {
      type: String,
      enum: ["Active", "Inactive", "Not Enrolled", null],
      default: null,
    },

    // ── Farm Details ─────────────────────────────────────────────
    landSize: {
      type: Number,
      min: 0,
      default: 0,
    },
    landUnit: {
      type: String,
      enum: ["Acre", "Hectare", "Bigha", "Gunta"],
      default: "Acre",
    },
    landOwnership: {
      type: String,
      enum: ["owner", "tenant", "sharecropper", null],
      default: null,
    },
    soilType: {
      type: String,
      trim: true,
      default: null,
    },
    livestock: {
      type: String,
      trim: true,
      default: null,
    },

    // ── Crops ────────────────────────────────────────────────────
    selectedCrops: {
      type: [String],
      enum: [
        "wheat", "rice", "maize", "soybean", "cotton",
        "sugarcane", "vegetables", "pulses", "fruits", "spices",
      ],
      default: [],
    },

    // ── Seasons ──────────────────────────────────────────────────
    selectedSeasons: {
      type: [String],
      enum: ["kharif", "rabi", "zaid"],
      default: [],
    },

    // ── Irrigation ───────────────────────────────────────────────
    irrigation: {
      type: [String],
      enum: ["borewell", "canal", "rainfed", "river", "pond", "drip"],
      default: [],
    },

    // ── Aadhaar ──────────────────────────────────────────────────
    aadhaar: {
      type: String,
      trim: true,
      match: [/^\d{12}$/, "Aadhaar must be exactly 12 digits"],
      default: null,
    },
    aadhaarVerified: {
      type: Boolean,
      default: false,
    },

    // ── Documents ────────────────────────────────────────────────
    documents: {
      type: Map,
      of: String,
      default: {},
    },

    // ── Meta ─────────────────────────────────────────────────────
    memberSince: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Guard against duplicate model registration
const FarmerProfile =
  mongoose.models.FarmerProfile ||
  mongoose.model("FarmerProfile", FarmerProfileSchema);

export default FarmerProfile;