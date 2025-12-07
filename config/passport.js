import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

export default function () {
  passport.use(
    new JWTStrategy(options, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.id);

        if (!user) return done(null, false);

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
}
