import UpdateLog from "../models/UpdateLog.js";

export const logActivity = async ({
  type = "general",
  userId,
  message,
  metadata = null,
}) => {
  if (!userId || !message) {
    return;
  }

  try {
    await UpdateLog.create({
      type,
      user: userId,
      message,
      metadata,
    });
  } catch (error) {
    console.error("Failed to create activity log:", error);
  }
};

export default { logActivity };
