import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";
import passport from "passport";
import uploader from "../services/upload.js";

const router = Router();

// passport.authenticate("register") // Para indicarle que queremos usar la estrategia register
router.post("/register", uploader.single("image"), passport.authenticate("register", { failureRedirect: "/api/sessions/failedRegister" }), sessionsController.register)

router.get("/failedRegister", sessionsController.failedRegister)

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/failedLogin" }), sessionsController.login)

router.get("/failedLogin", sessionsController.failedLogin)

router.get("/logout", sessionsController.logout)

router.get("/user", sessionsController.user)

export default router
