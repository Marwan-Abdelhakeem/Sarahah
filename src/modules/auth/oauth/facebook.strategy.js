import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import { User } from "../../../../db/user.model.js";

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const photoUrl = `https://graph.facebook.com/${profile.id}/picture?type=large&width=1080&height=1080&access_token=${accessToken}`;
        let user = await User.findOne({ providerId: profile.id });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            photo: {
              secure_url: photoUrl,
              provider: "facebook",
            },
            provider: "facebook",
            providerId: profile.id,
          });
        } else {
          user.photo.secure_url = photoUrl;
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);
