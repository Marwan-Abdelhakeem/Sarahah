import mongoose from "mongoose";

export const connectDB = () =>
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("DB connected successfully"))
    .catch(() => console.log("DB not connected"));
