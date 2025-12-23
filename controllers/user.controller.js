import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { logActivity } from "../utils/activityLogger.js";

export const getAllAccount = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select("-password -__v").sort("role").skip(skip).limit(limit),
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

      await logActivity({
        type: "admin",
        userId: req.user?._id,
        message: `Added ${newUser.name} Account`,
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

    await logActivity({
      type: "admin",
      userId: req.user?._id,
      message: `Deleted ${user.name} Account`,
    });

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

export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid user id", null, 400);
    }

    const user = await User.findById(id).select("-password -__v");
    if (!user) {
      return sendError(res, "User not found", null, 404);
    }

    return sendSuccess(res, user, "Account found", 200);
  } catch (error) {
    console.error("Error get account:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const updateAccountById = async (req, res) => {
  try {
    const { id } = req.params || {};

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, "Invalid user id", null, 400);
    }

    const { name, email, password, role } = req.body || {};

    if (!name && !email && !password && !role) {
      return sendError(res, "No fields provided for update", null, 400);
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return sendError(res, "User not found", null, 404);
    }

    const isRequesterAdmin = req.user?.role === "admin";
    const isTargetAdmin = targetUser.role === "admin";
    const isSameUser = req.user?._id?.toString() === id;

    if (isRequesterAdmin && isTargetAdmin && !isSameUser) {
      return sendError(
        res,
        "Admins cannot modify other admin accounts",
        null,
        403
      );
    }

    if (email) {
      const duplicateEmailUser = await User.findOne({
        email,
        _id: { $ne: id },
      });
      if (duplicateEmailUser) {
        return sendError(res, "Email already in use", null, 409);
      }
    }

    const updatePayload = {};
    if (name) updatePayload.name = name;
    if (email) updatePayload.email = email;
    if (role) updatePayload.role = role;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updatePayload.password = hashed;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password -__v");

    await logActivity({
      type: "admin",
      userId: req.user?._id,
      message: `Updated ${updatedUser.name} Account`,
    });

    return sendSuccess(res, updatedUser, "Account updated successfully", 200);
  } catch (error) {
    console.error("Error updating account:", error);
    return sendError(res, "Internal server error", null);
  }
};
