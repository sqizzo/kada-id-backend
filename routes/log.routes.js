import { Router } from "express";
import passport from "passport";
import { getAllLogs, getRecentLogs } from "../controllers/log.controller.js";
import { isAdmin } from "../middlewares/rbac.js";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getAllLogs
);

router.get(
  "/recent",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getRecentLogs
);

export default router;
