import { Router } from "express";
import randomsControllers from "../controllers/randoms.controllers.js";

const router = Router();

router.get("/", randomsControllers.randoms)

export default router
