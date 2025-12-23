import UpdateLog from "../models/UpdateLog.js";
import { sendError, sendSuccess } from "../utils/response.js";

export const getAllLogs = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 20)
    );
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      UpdateLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email role"),
      UpdateLog.countDocuments(),
    ]);

    return sendSuccess(
      res,
      {
        data: logs,
        meta: {
          page,
          limit,
          total,
          totalPage: Math.ceil(total / limit),
        },
      },
      "Logs fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching logs:", error);
    return sendError(res, "Internal server error", null);
  }
};

export const getRecentLogs = async (req, res) => {
  try {
    const limit = Math.min(5, Math.max(1, parseInt(req.query.limit, 10) || 5));

    const logs = await UpdateLog.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name email role");

    return sendSuccess(res, logs, "Recent logs fetched", 200);
  } catch (error) {
    console.error("Error fetching recent logs:", error);
    return sendError(res, "Internal server error", null);
  }
};
