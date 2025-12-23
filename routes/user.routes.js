import { Router } from "express";
import passport from "passport";

import {
  addAccount,
  deleteAccountById,
  getAccountById,
  getAllAccount,
  updateAccountById,
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

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getAccountById
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  updateAccountById
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  deleteAccountById
);

export default router;
