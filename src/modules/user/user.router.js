import express, { Router } from "express";
import { getUser, removePhoto, send, uploadPhoto } from "./user.controller.js";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { sendMessage, userId } from "./user.validation.js";
const userRouter = Router();

userRouter.post("/send/:id", validate(sendMessage), send);
userRouter.get("/:id", validate(userId), getUser);
userRouter.post(
  "/upload-photo",
  cloudUpload({ uploadType: "single", fieldName: "photo", maxSizeMB: 7 }),
  uploadPhoto
);
userRouter.post("/remove-photo", removePhoto);

export default userRouter;
