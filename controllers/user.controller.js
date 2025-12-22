import mongoose from "mongoose";
import User from "../models/User.js";
import { sendError, sendSuccess } from "../utils/response.js";
import bcrypt from "bcrypt";

export const getAllAccount = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select("-password -__v").skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return sendSuccess(
      res,
      {
        data: users,
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      "Successfully get all account",
      200
    );
  } catch (error) {
    console.error("Error get all account:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const addAccount = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return sendError(res, "Missing required fields", null, 400);
    }

    const user = await User.findOne({ email });
    if (user) {
      return sendError(res, "User already registered", null, 409);
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });

      return sendSuccess(
        res,
        {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        "Account created successfully",
        201
      );
    }
  } catch (error) {
    console.error("Error adding account:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const deleteAccountById = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid user id", null, 400);
    }

    if (req.user && req.user._id?.toString() === id) {
      return sendError(res, "You cannot delete your own account", null, 400);
    }

    const user = await User.findById(id);
    if (!user) {
      return sendError(res, "User not found", null, 404);
    }

    if (user.role == "admin") {
      return sendError(res, "You cannot delete another admin", null, 400);
    }

    await user.deleteOne();

    return sendSuccess(
      res,
      { id: user._id, email: user.email },
      "Account deleted successfully",
      200
    );
  } catch (error) {
    console.error("Error deleting account:", error);
    return sendError(res, "Internal server error", null);
  }
};
