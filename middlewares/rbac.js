import { sendError } from "../utils/response.js";

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} roles - Single role or array of allowed roles
 */
export const hasRole = (roles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return sendError(res, "Authentication required", 401);
      }

      // Convert single role to array for consistent checking
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return sendError(
          res,
          "Insufficient permissions. Required role: " +
            allowedRoles.join(" or "),
          403
        );
      }

      next();
    } catch (error) {
      return sendError(res, "Authorization error: " + error.message, 500);
    }
  };
};

/**
 * Middleware to verify admin role
 */
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, "Authentication required", 401);
    }

    if (req.user.role !== "admin") {
      return sendError(res, "Access denied. Admin privileges required", 403);
    }

    next();
  } catch (error) {
    return sendError(res, "Authorization error: " + error.message, 500);
  }
};

/**
 * Middleware to verify moderator or admin role
 */
export const isModerator = (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, "Authentication required", 401);
    }

    if (!["moderator", "admin"].includes(req.user.role)) {
      return sendError(
        res,
        "Access denied. Moderator or Admin privileges required",
        403
      );
    }

    next();
  } catch (error) {
    return sendError(res, "Authorization error: " + error.message, 500);
  }
};

/**
 * Middleware to verify moderator role only (not admin)
 */
export const isModeratorOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return sendError(res, "Authentication required", 401);
    }

    if (req.user.role !== "moderator") {
      return sendError(
        res,
        "Access denied. Moderator privileges required",
        403
      );
    }

    next();
  } catch (error) {
    return sendError(res, "Authorization error: " + error.message, 500);
  }
};
