import QrCode from "qrcode";
import { Message } from "../../../db/message.model.js";
import { User } from "../../../db/user.model.js";
import cloudinary from "../../utils/cloudinary.js";

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    req.flash("error", "user not found");
    return res.redirect("/");
  }
  let url = `${req.protocol}://${req.headers.host}/user/${req.params.id}`;
  let qrCode = await QrCode.toDataURL(url);
  res.render("user.ejs", {
    user,
    url,
    qrCode,
  });
};

export const send = async (req, res, next) => {
  if (req.session.userId == req.params.id) {
    req.flash(
      "error",
      "You cannot send a Sarahah to yourself, share your profile with your friends :)"
    );
    return res.redirect("/user/" + req.params.id);
  }
  req.body.user = req.params.id;
  await Message.create(req.body);
  res.redirect("/user/" + req.params.id);
};

export const uploadPhoto = async (req, res, next) => {
  if (!req.file) {
    return res.redirect("/message");
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: "Sarahah/user",
      public_id: req.session.userId,
      overwrite: true,
      invalidate: true,
    }
  );
  const photo = { secure_url, public_id };
  req.session.photo = secure_url;
  await User.findByIdAndUpdate(req.session.userId, { photo });
  res.redirect("/message");
};

export const removePhoto = async (req, res, next) => {
  await cloudinary.uploader.destroy("Sarahah/user/" + req.session.userId, {
    invalidate: true,
  });
  await User.findByIdAndUpdate(req.session.userId, { photo: null });
  req.session.photo = null;
  res.redirect("/message");
};
