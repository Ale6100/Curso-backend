"use strict";

import express from "express";
import productosRouter from "./routes/productos.routes.js";
import __dirname from "./utils.js";
import uploader from "./services/upload.js";
import Contenedor from "./Contenedor.js";

const app = express();

const server = app.listen(8080, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`));

server.on("error", error => console.log(error)); // En caso de que haya un error en la puesta en marcha del servidor

app.set("views", `${__dirname}/views`); // Ubicación de las vistas
app.set("view engine", "ejs"); // Configuramos EJS como el motor de visualización de nuestra app

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended:true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use(express.static(__dirname + "/public")); // Quiero que mi servicio de archivos estáticos se mantenga en public

app.use("/api/productos", productosRouter);

const contenedor = new Contenedor("productos")

app.get("/", (req, res) => { // Renderiza formulario.ejs en la ruta "/"
    res.render("formulario")
})

app.get("/productos", async (req, res) => { // Obtengo la totalidad de productos y luego los renderizo en el componente "productosCargados" en la ruta /productos
    const arrayProductos = await contenedor.getAll()
    res.render("productosCargados", { arrayProductos })
})

app.post("/productos", uploader.single("image"), async (req, res) => { // Agrega un producto al json gracias al formulario de la ruta raíz
    const producto = req.body;
    producto.image = `${req.protocol}://${req.hostname}:8080/images/${req.file.filename}`
    await contenedor.save(producto)
    res.redirect("/") // Te redirige a la ruta raíz una vez que hayas enviado el formulario
})
