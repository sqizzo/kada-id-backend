import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import passport from "passport";
import cookieParser from "cookie-parser";

// Config
import { connection } from "./config/database.js";
import passportConfig from "./config/passport.js";

// Utils
import { errorHandler } from "./utils/errorHandler.js";

// Routes
import authRoutes from "./routes/auth.routes.js";

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

app.use("/api/auth", authRoutes);

app.use(errorHandler);

connection().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${BASE_URL}:${PORT}`);
    console.log(`Client running on ${CLIENT_URL}`);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});
