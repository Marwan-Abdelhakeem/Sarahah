import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import { User } from "../../../../db/user.model.js";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email)
          return done(new Error("Email not provided by Facebook"), false);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          name: profile.displayName,
          email,
          photo: {
            secure_url: profile.photos?.[0]?.value,
            provider: "facebook",
          },
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
