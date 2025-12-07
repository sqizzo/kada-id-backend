import { Router } from "express";
import passport from "passport";
import { login, refreshToken, me } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/refresh", refreshToken);

router.get("/me", passport.authenticate("jwt", { session: false }), me);

export default router;
