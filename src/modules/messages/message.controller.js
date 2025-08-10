import QrCode from "qrcode";
import { Message } from "../../../db/message.model.js";
export const getMessages = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    const url = `${req.protocol}://${req.headers.host}/user/${req.session.userId}`;
    const qrCode = await QrCode.toDataURL(url);
    const messages = await Message.find({ user: req.session.userId });

    return res.render("message.ejs", {
      url,
      qrCode,
      messages,
      photo: req.session.photo,
    });
  }
  return res.redirect("/auth/login");
};
