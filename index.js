import path from "path";
import dotenv from "dotenv";
import express from "express";
import flash from "connect-flash";
import { connectDB } from "./db/connection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import messageRouter from "./src/modules/messages/message.router.js";
import userRouter from "./src/modules/user/user.router.js";
import { sessionConfig } from "./db/session.js";
import passport from "passport";

import "./src/modules/auth/oauth/google.strategy.js";
import "./src/modules/auth/oauth/facebook.strategy.js";
import "./src/modules/auth/oauth/passport.js";

dotenv.config({ path: path.resolve("./config/.env") });

const app = express();
const port = +process.env.PORT || 3000;
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(path.resolve(), "public")));
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

app.use(flash());
app.get((req, res, next) => {
  delete req.session.flash;
});
app.use(sessionConfig());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res, next) => {
  res.render("home.ejs");
  // delete req.session.flash;
});

app.use("/auth", authRouter);
app.use("/message", messageRouter);
app.use("/user", userRouter);

app.use((req, res) => {
  req.flash(
    "error",
    `❌ ${req.method} ${req.originalUrl} - Page not found (404)`
  );
  return res.redirect("/");
});

app.listen(port, () => console.log("server is running on port", port));
