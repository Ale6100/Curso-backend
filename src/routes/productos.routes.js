import { Router } from "express";
import productosController from "../controllers/productos.controller.js";

const router = Router(); // Inicializamos el router

router.get("/", productosController.getAll)
router.get("/:pid", productosController.getById)

router.post("/", productosController.save)

router.put("/:pid", productosController.update)

router.delete("/:pid", productosController.deleteById)

export default router;
