import { Router } from "express";
import paymentsControllers from "../controllers/payments.controllers.js";

const router = Router();

router.post("/payment-intents", paymentsControllers.paymentIntents)

router.put("/updateCartDeleteStockSendMail", paymentsControllers.updateCartDeleteStockSendMail)

export default router;
