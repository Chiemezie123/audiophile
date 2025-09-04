import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { UserDocument } from "../models/userModel.js";

// Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${
        process.env.SERVER_URL || "http://localhost:4000"
      }/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        // Check if user exists with same email (from local registration)
        existingUser = await User.findOne({
          email: profile.emails?.[0]?.value,
        });

        if (existingUser) {
          // Link Google account to existing user
          existingUser.googleId = profile.id;
          existingUser.photo = profile.photos?.[0]?.value || existingUser.photo;
          existingUser.isEmailVerified = true;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Create new user from Google profile
        const newUser = new User({
          googleId: profile.id,
          firstName:
            profile.name?.givenName ||
            profile.displayName?.split(" ")[0] ||
            "User",
          lastName:
            profile.name?.familyName ||
            profile.displayName?.split(" ")[1] ||
            "",
          email: profile.emails?.[0]?.value,
          photo: profile.photos?.[0]?.value || "default.jpg",
          authProvider: "google",
          isEmailVerified: true,
          role: "user",
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
