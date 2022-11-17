import { Router } from "express"; 
import Contenedor from "../Managers/Contenedor.js";
import uploader from "../services/upload.js";

const router = Router(); // Inicializamos el router

const contenedor = new Contenedor("productos");

router.get("/", async (req, res) => { // Obtengo la totalidad de productos y luego los renderizo en el componente "productosCargados" en la ruta /productos
    const arrayProductos = await contenedor.getAll()
    res.render("productosCargados", { arrayProductos })
})

router.post("/", uploader.single("image"), async (req, res) => { // Agrega un producto al json gracias al formulario de la ruta raíz
    const producto = req.body;
    producto.image = `${req.protocol}://${req.hostname}:8080/images/${req.file.filename}`
    await contenedor.save(producto)
    res.redirect("/") // Te redirige a la ruta raíz una vez que hayas enviado el formulario
})

export default router;
