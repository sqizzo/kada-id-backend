import { Router } from "express";

import { getActiveProgram } from "../controllers/program.controller.js";

const router = Router();

// Public route to get active program
router.get("/program/active", getActiveProgram);

export default router;
