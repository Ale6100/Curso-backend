import { Router } from "express";
import baseControllers from "../controllers/base.controllers.js";

const router = Router();

router.get("/", baseControllers.base)

router.post("/api/sendNewMail", baseControllers.sendNewMail)

export default router;
