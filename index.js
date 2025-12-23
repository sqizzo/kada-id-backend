import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";
import logger from "./utils/logger.js";
import requestLogger from "./utils/requestLogger.js";

// Config
import { connection } from "./config/database.js";
import passportConfig from "./config/passport.js";

// Utils
import { errorHandler } from "./utils/errorHandler.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import logRoutes from "./routes/log.routes.js";
import programRoutes from "./routes/program.routes.js";
import publicRoutes from "./routes/public.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://localhost";
const CLIENT_URL = process.env.CLIENT_BASE_URL || "http://localhost:5173";

const corsOptions = {
  origin: CLIENT_URL,
  credentials: true,
};

passportConfig();
app.use(passport.initialize());
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
// HTTP request logging
app.use(requestLogger);

app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/program", programRoutes);

app.use(errorHandler);

connection()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server running on ${BASE_URL}:${PORT}`);
      logger.info(`Client running on ${CLIENT_URL}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to connect to database", err);
    process.exit(1);
  });

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});
