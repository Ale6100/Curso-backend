import { Router } from "express"; 
// import Contenedor from "../Managers/Contenedor.js";
import uploader from "../services/upload.js";
import ContenedorSQL from "../Managers/ContenedorSQL.js";
import sqliteOptions from "../dbs/knew.js"

const router = Router(); // Inicializamos el router

// const contenedor = new Contenedor("productos");
const contenedorSQL = new ContenedorSQL(sqliteOptions, "products")

router.post("/", uploader.single("image"), async (req, res) => { // Agrega un producto al sqlite3 gracias al formulario de la ruta raíz
    const producto = req.body;
    producto.image = `${req.protocol}://${req.hostname}:8080/images/${req.file.filename}`
    // await contenedor.save(producto)
    await contenedorSQL.save(producto)
    res.redirect("/") // Te redirige a la ruta raíz una vez que hayas enviado el formulario
})

export default router;
