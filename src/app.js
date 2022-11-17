"use strict";

import express from "express";
import productosRouter from "./routes/productos.routes.js";
import __dirname from "./utils.js";
import Contenedor from "./Managers/Contenedor.js";
import viewsProductosRouter from "./routes/views.productos.routes.js"
import carritoRouter from "./routes/carrito.routes.js"
import { Server } from "socket.io";
import chatRouter from "./routes/views.chat.routes.js"

const app = express();

const PORT = process.env.PORT || 8080; // Elige el puerto 8080 en caso de que no tenga
const server = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`));

let admin = true;

const io = new Server(server) // io va a ser el servidor del socket. Va a estar conectado con nuestro servidor actual

server.on("error", error => console.log(error)); // En caso de que haya un error en la puesta en marcha del servidor

app.set("views", `${__dirname}/views`); // Ubicación de las vistas
app.set("view engine", "ejs"); // Configuramos EJS como el motor de visualización de nuestra app

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended:true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use(express.static(__dirname + "/public")); // Quiero que mi servicio de archivos estáticos se mantenga en public

app.use("/api/products", productosRouter) // Ruta donde se carga y se visualizan productos con Postman
app.use("/api/cart", carritoRouter)
app.use("/productos", viewsProductosRouter) // Ruta donde se visualizan los productos
app.use("/chat", chatRouter) // Ruta donde está el chat

const contenedorProductos = new Contenedor("productos")

app.get("/", (req, res) => { // Renderiza formulario en la ruta "/" que sirve para cargar productos
    res.render("formulario")
})

let mensajes = [];

const contenedorHistorialChats = new Contenedor("historialChats")

contenedorHistorialChats.getAll().then(response => mensajes = response) // Antes de iniciar el chat (justo después del npm start) recupera los mensajes del historial en caso de que haya

io.on("connection", socket => {

    // Hago que se envíe el array actualizado de productos a todos los sockets cada vez que se conecta un socket (recordemos que al enviar el formulario el usuario va a una ruta y vuelve a la principal rápidamente. En ese caso es como si se hubiera conectado un nuevo socket, lo que provocaría que esta función se ejecute)
    contenedorProductos.getAll().then(arrayProductos => {
        io.emit("enviarArray", arrayProductos)
    })

    socket.emit("logs", mensajes) // Envío al usuario el array (que contiene todos los mensajes pasados) para que le muestre el historial de mensajes apenas se loguee

    socket.on("message", data => { // Recibo los datos emitidos en chat.js
        mensajes.push(data)
        io.emit("logs", mensajes) // Enviamos al io en vez de al socket para que el array llegue a todos los sockets (usuarios)
        contenedorHistorialChats.save( data ).then(res => res) // Guardo los datos (el mensaje que se envió junto con su usuario) y la fecha en un archivo json llamado "historialChats.json"
        //! Gracias a esta última línea el chat no puede funcionar correctamente mientras desarrollemos con nodemon, ya que al guardar el objeto estaríamos actualizando el código y nodemon lo ejecutaría de nuevo, provocando que los sockets se reinicien y el chat se borre del DOM. Si bien se recupera el chat gracias al historial, dejará de funcionar (junto con el chat) si se envían muchos mensajes muy rápido
    })

    socket.on("autenticado", data => {
        socket.broadcast.emit("newUserConnected", data) // El brodcast hace que se envíe a todos menos al socket (usuario) que desencadena el evento
    })
})
