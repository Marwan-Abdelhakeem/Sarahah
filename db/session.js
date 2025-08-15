import session from "express-session";
import mongoSession from "connect-mongodb-session";

const MongoDBStore = mongoSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySession",
});

export const sessionConfig = () =>
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 2,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    },
  });
