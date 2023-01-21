import { Router } from "express";
import viewsFormUsersController from "../controllers/views.formUsers.controller.js";

const router = Router();

router.get("/register", viewsFormUsersController.register)

router.get("/login", viewsFormUsersController.login)

export default router
