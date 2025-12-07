import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["moderator", "admin"],
      default: "moderator",
      required: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving (only when modified)
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
  bcrypt
    .hash(this.password, saltRounds)
    .then((hashed) => {
      this.password = hashed;
      next();
    })
    .catch((err) => next(err));
});

export default mongoose.model("User", userSchema);
