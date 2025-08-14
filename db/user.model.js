import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    photo: Object,
    provider: {
      type: String,
      enum: ["sarahah", "facebook", "google"],
      default: "sarahah",
    },
    providerId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);
export const User = model("User", userSchema);
