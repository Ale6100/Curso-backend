import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";
import uploader from "../services/upload.js";

const router = Router();

router.post("/register", uploader.single("image"), sessionsController.register)

router.post("/login", sessionsController.login)

router.get("/current", sessionsController.current)

router.post("/passwordRestoreRequest", sessionsController.passwordRestoreRequest)

router.post("/restorePassword", sessionsController.restorePassword)

router.get("/logout", sessionsController.logout)

export default router
