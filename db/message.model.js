import { model, Schema } from "mongoose";

const messageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    message: String,
  },
  { timestamps: true }
);
export const Message = model("Message", messageSchema);
