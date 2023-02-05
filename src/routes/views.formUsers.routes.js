import { Router } from "express";
import viewsFormUsersController from "../controllers/views.formUsers.controller.js";

const router = Router();

router.get("/register", viewsFormUsersController.register)

router.get("/login", viewsFormUsersController.login)

router.get("/passwordRestoreRequest", viewsFormUsersController.passwordRestoreRequest)

router.get("/restorePassword", viewsFormUsersController.restorePassword)

export default router
