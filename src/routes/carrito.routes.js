import { Router } from "express"; 
import carritoController from "../controllers/carrito.controller.js";

const router = Router();

router.get("/", carritoController.getAll)
router.get("/:cid/products", carritoController.getById)

router.post("/", carritoController.save)
router.post("/:cid/products/:pid", carritoController.saveContainerInContainer)

router.delete("/:cid", carritoController.deleteById)
router.delete("/:cid/products/:pid", carritoController.deleteContainerInContainer)

export default router;
