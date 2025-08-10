import { Router } from "express";
import { getMessages } from "./message.controller.js";
const messageRouter = Router();

messageRouter.get("/", getMessages);

export default messageRouter;
