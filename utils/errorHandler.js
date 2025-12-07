import logger from "./logger.js";
import { sendError } from "./response.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  return sendError(
    res,
    err.message || "Internal Server Error",
    null,
    err.status || 500
  );
};

export default errorHandler;
