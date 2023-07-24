import { Router } from "express";
import productosController from "../controllers/productos.controller.js";
import uploader from "../services/upload.js";

const router = Router(); // Inicializamos el router

router.get("/", productosController.getAll)

router.get("/:pid", productosController.getById)

router.get("/title/:ptitle", productosController.getByTitle)

router.post("/", uploader.single("image"), productosController.save)

router.put("/:pid", uploader.single("image"), productosController.update)

router.delete("/:pid", productosController.deleteById)

export default router;
