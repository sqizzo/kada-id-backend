import { Router } from "express";
import passport from "passport";

import {
  getAllProgramSettings,
  getProgramSettingById,
  addProgramSetting,
  updateProgramSetting,
  deleteProgramSetting,
  setProgramSettingActive,
} from "../controllers/program.controller.js";

import { isAdmin } from "../middlewares/rbac.js";

const router = Router();

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getAllProgramSettings
);

router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  getProgramSettingById
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  addProgramSetting
);

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  updateProgramSetting
);

router.patch(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  setProgramSettingActive
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  deleteProgramSetting
);

export default router;
