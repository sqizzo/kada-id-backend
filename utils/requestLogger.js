import morgan from "morgan";
import logger from "./logger.js";

// Use a different format for development vs production
const format = process.env.NODE_ENV === "production" ? "combined" : "dev";

const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

const requestLogger = morgan(format, { stream });

export default requestLogger;
