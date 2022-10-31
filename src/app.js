"use strict";

import express from "express";
import productosRouter from "./routes/productos.routes.js";
import __dirname from "./utils.js";

const app = express();

const server = app.listen(8080, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`));

server.on("error", error => console.log(error)); // En caso de que haya un error en la puesta en marcha del servidor

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended:true })); // Habilita poder procesar y parsear datos más complejos en la url
app.use(express.static(__dirname + "/public")); // Quiero que mi servicio de archivos estáticos se mantenga en public

app.use("/api/productos", productosRouter);
