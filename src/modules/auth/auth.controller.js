import ejs from "ejs";
import { User } from "../../../db/user.model.js";
import { sendEmail } from "../../utils/email.js";

export const register = (req, res, next) => {
  res.render("register.ejs");
};

export const handleRegister = async (req, res, next) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    req.flash("error", "user already exists");
    return res.redirect("register");
  }
  await User.create(req.body);
  res.redirect("login");
};

export const login = (req, res, next) => {
  res.render("login.ejs");
};

export const oauthLogin = (req, res, next) => {
  req.session.photo = req.user.photo?.secure_url;
  req.session.isLoggedIn = true;
  req.session.name = req.user.name;
  req.session.email = req.user.email;
  req.session.userId = req.user._id.toString();
  res.redirect("/message");
};

export const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (!userExist || !(userExist.password == password)) {
    req.flash("error", "invalid credential");
    return res.redirect("login");
  }
  req.session.photo = userExist.photo.secure_url;
  req.session.isLoggedIn = true;
  req.session.name = userExist.name;
  req.session.email = userExist.email;
  req.session.userId = userExist._id.toString();
  res.redirect("/message");
};

export const logout = async (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("login");
  });
};

export const forgotPass = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    req.flash("error", "Email not found");
    return res.redirect("login");
  }

  req.session.email = user.email;
  req.session.userId = user._id.toString();

  const OTP = Math.floor(100000 + Math.random() * 900000);

  req.session.otp = OTP;
  req.session.otpExpiration = Date.now() + 15 * 60 * 1000;
  const emailHtml = await ejs.renderFile("./views/otpEmail.ejs", { OTP });

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: emailHtml,
  });

  return res.redirect("resetPassword");
};

export const resetPass = async (req, res, next) => {
  const { otp, password } = req.body;

  if (+otp !== req.session.otp || req.session.otpExpiration < Date.now()) {
    req.flash("error", "invalid OTP or expire");
    return res.redirect("resetPassword");
  }
  req.session.otp = null;
  req.session.otpExpiration = null;
  await User.findByIdAndUpdate(req.session.userId, { password });
  return res.redirect("login");
};

export const getResetPass = async (req, res, next) => {
  if (req.session.otpExpiration < Date.now()) {
    return res.redirect("login");
  }
  return res.render("resetPassword.ejs");
};
