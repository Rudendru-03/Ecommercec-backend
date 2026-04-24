const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../model/User");

require("dotenv").config({ quiet: true });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.Google_client_id,
      clientSecret: process.env.Google_client_secret,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Code to handle user authentication and retrieval
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        Image: profile.photos?.[0]?.value,
      };

      try {
        // Check if user exists, if not create them
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  // Code to serialize user data
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // Code to deserialize user data
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
