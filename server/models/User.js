import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Guard against duplicate model registration
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;