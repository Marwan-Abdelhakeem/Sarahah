import { Router } from "express";
import passport from "passport";
import {
  login,
  logout,
  register,
  handleLogin,
  handleRegister,
  forgotPass,
  getResetPass,
  resetPass,
  oauthLogin,
} from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  forgetPassVal,
  loginVal,
  registerVal,
  resetPassVal,
} from "./auth.validation.js";

const authRouter = Router();

authRouter.get("/register", register);
authRouter.get("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/resetPassword", getResetPass);
authRouter.post("/handleRegister", validate(registerVal), handleRegister);
authRouter.post("/handleLogin", validate(loginVal), handleLogin);
authRouter.post("/forgotPass", validate(forgetPassVal), forgotPass);
authRouter.post("/resetPassword", validate(resetPassVal), resetPass);

// Google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  oauthLogin
);

// Facebook;
authRouter.get("/facebook", passport.authenticate("facebook"));

authRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  oauthLogin
);

export default authRouter;
