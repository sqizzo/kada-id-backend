import { Router } from "express";
import passport from "passport";

import { addAccount, getAllAccount } from "../controllers/user.controller.js";
import { isAdmin } from "../middlewares/rbac.js";

const router = Router();

router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  addAccount
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getAllAccount
);

export default router;
