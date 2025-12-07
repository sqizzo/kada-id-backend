import User from "../models/User.js";
import bcrypt from "bcrypt";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return sendError(res, "Email and password are required", null, 400);
    }

    const user = await User.findOne({ email });
    if (!user) return sendError(res, "User not found", null, 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, "Invalid credentials", null, 401);

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    const responseData = {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    return sendSuccess(res, responseData, "Login successful", 200);
  } catch (err) {
    console.error("Auth login error:", err);
    return sendError(res, "Internal server error", null, 500);
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return sendError(res, "Refresh token is missing", null, 401);
    }

    const decoded = await verifyRefreshToken(token);

    const user = await User.findById(decoded.id);
    if (!user) return sendError(res, "User not found", null, 404);

    const newAccessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };

    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    const responseData = {
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    return sendSuccess(res, responseData, "Token refreshed", 200);
  } catch (error) {
    console.error("Refresh token error:", error);
    return sendError(res, "Invalid refresh token", null, 403);
  }
};

export const me = async (req, res) => {
  try {
    const user = req.user;

    if (!user) return sendError(res, "Not authenticated", null, 401);

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return sendSuccess(res, { user: userData }, "User profile", 200);
  } catch (err) {
    console.error("Auth me error:", err);
    return sendError(res, "Internal server error", null, 500);
  }
};

export const logout = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };

    res.clearCookie("refreshToken", cookieOptions);

    return sendSuccess(res, null, "Logged out", 200);
  } catch (err) {
    console.error("Logout error:", err);
    return sendError(res, "Failed to logout", null, 500);
  }
};
