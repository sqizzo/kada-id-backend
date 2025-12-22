import { Router } from "express";
import passport from "passport";

import {
  addAccount,
  deleteAccountById,
  getAllAccount,
} from "../controllers/user.controller.js";
import { isAdmin } from "../middlewares/rbac.js";

const router = Router();

router.post(
  "/",
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

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  deleteAccountById
);

export default router;
