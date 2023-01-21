import { Router } from "express";
import baseControllers from "../controllers/base.controllers.js";

const router = Router();

router.get("/", baseControllers.base)

router.get("/profile", baseControllers.profile)

router.get("/info", baseControllers.info)

router.get("/cart", baseControllers.cart)

router.put("/cart/comprar", baseControllers.comprar)

export default router;
