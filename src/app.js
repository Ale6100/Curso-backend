"use strict";

import express from "express";
import productosRouter from "./routes/productos.routes.js";
import __dirname from "./utils.js";
import { Contenedor } from "./daos/index.js";
import carritoRouter from "./routes/carrito.routes.js"
import { Server } from "socket.io";
import chatRouter from "./routes/views.chat.routes.js"
import { normalize, schema } from "normalizr";
import formUsersRouter from "./routes/views.formUsers.routes.js"
import sessionsRouter from "./routes/sessions.routes.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import randomsRouter from "./routes/randoms.routes.js"

import session from "express-session";
import MongoStore from "connect-mongo";
import config from "./config/config.js";

const app = express();

const PORT = process.env.PORT || 8080; // Elige el puerto 8080 en caso de que no tenga
const server = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`));

server.on("error", error => console.log(error)); // En caso de que haya un error en la puesta en marcha del servidor

const io = new Server(server) // io va a ser el servidor del socket. Va a estar conectado con nuestro servidor actual

app.set("views", `${__dirname}/views`); // Ubicación de las vistas
app.set("view engine", "ejs"); // Configuramos EJS como el motor de visualización de nuestra app

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use(express.static(__dirname + "/public")); // Quiero que mi servicio de archivos estáticos se mantenga en public

app.use("/api/products", productosRouter) // Ruta donde se carga y se visualizan productos con Postman
app.use("/api/cart", carritoRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/randoms", randomsRouter)
app.use("/chat", chatRouter) // Ruta donde está el chat
app.use("/formUsers", formUsersRouter)

const contenedorProductos = new Contenedor("productos")

const password = config.mongo.password
const database = "dbSession" // Si no existe, la crea

app.use(session({
    store: MongoStore.create({ // Crea un sistema de almacenamiento en Mongo. Guarda la session en Mongo
        mongoUrl: `mongodb+srv://backendCoder:${password}@cluster1.typ6zn6.mongodb.net/${database}?retryWrites=true&w=majority`,
        ttl: 60*60*24*7 // El time to live lo dejo en 7 días
    }),
    secret: "asd",
    resave: false, // Esta propiedad y la de abajo las dejo en false porque la persistencia y el sistema de vida de la session la maneja el store
    saveUninitialized: false
}))

initializePassport(); // Inicializamos las estrategias de passport. Genera las estrategias a utilizar
app.use(passport.initialize()); // Genera el corazón de passport
app.use(passport.session()); // Le decimos a passport que conecte con las sessiones que tenemos

app.get("/", async (req, res) => { // Renderiza formulario en la ruta "/" que sirve para cargar productos)
    const usuario = req.session.user
    if (usuario === undefined) {
        res.render("formLogin")
    } else {
        const arrayProductos = await contenedorProductos.getAll()
        res.render("index", { arrayProductos, usuario })
    }
})

app.get("/profile", async (req, res) => {
    const usuario = req.session.user
    if (usuario) {
        res.render("profile", { usuario })
    } else {
        res.status(401).send({ status: "error", error: "No authenticated" })
    }
})

app.get("/info", async (req, res) => {
    const info = {
        argumentosEntrada: process.argv.slice(2),
        sistemaOperativo: process.platform,
        versionNode: process.version,
        memoriaTotalReservada: process.memoryUsage(),
        pathEjecucion: __dirname,
        processId: process.pid,
        carpetaProyecto: process.cwd()
    }
    res.render("info", { info })
})

const nomalizarMensajes = (objetoContenedorMensajes) => { // Normaliza el objeto que paso como parámetro (sólo sirve para este objeto)
    const usuario = new schema.Entity("users") // Entidad que usaré para el objeto author
    
    const mensaje = new schema.Entity("mensajes", { // Entidad que usaré para cada elemento del array "mensajes"
        author: usuario // Especifico que depende de la propiedad author, que a su vez depende de la entidad usuario
    },  { idAttribute: "_id" }) // Especifico que el id de esta entidad será la propiedad "_id", no "id" como viene por defecto
    
    const objetoEntity = new schema.Entity("contenedor", { // Entidad que usaré para el objeto contenedor más grande (objetoContenedorMensajes)
        mensajes: [mensaje] // Especifico que depende de la propiedad mensajes, que a su vez es un array que depende de la entidad mensaje
    })

    const normalizedData = normalize(objetoContenedorMensajes, objetoEntity)
    console.log("Data original:\n", JSON.stringify(objetoContenedorMensajes, null, "\t"))
    console.log("Data normalizada:\n", JSON.stringify(normalizedData, null, "\t"))
    
    return [normalizedData, objetoEntity] // Retorno la data normalizada, pero también el objetoEntity ya que en el futuro podría servirme para desnormalizar
}

const quitarNewObjetId = (arrayChat) => { // Aparentemente no se puede normalizar si el array contenedor tiene objetos con la propiedad _id de MongoDB. Tal parece que el problema real está en el "new ObjetID". Esta función retorna el mismo array pero quitándole el new ObjetID y quedándose únicamente con el valor del id. Aproveché y también quité el __v. 
    return arrayChat.map(elemento => {
        const elementoModificado = {
            author: elemento.author,
            text: elemento.text,
            _id: elemento._id.valueOf() // Ejemplo: new ObjetID("asdasd") se convierte en "asdasd"
        }
        return elementoModificado
    })
}

// let mensajes = [];

const contenedorHistorialChats = new Contenedor("historialChats")

app.get("/api/messages/normalizr", async (req, res) => {
    let arrayChat = await contenedorHistorialChats.getAll()
    arrayChat = quitarNewObjetId(arrayChat)
    const mensajesNormalizados = nomalizarMensajes({ id: "mensajes", mensajes: arrayChat })
    res.send({ status: "sucess", payload: { mensajesNormalizados } })
})

// contenedorHistorialChats.getAll().then(response => { // Antes de iniciar el chat (justo después del npm start) recupera los mensajes del historial en caso de que haya
//      mensajes = response
// })

//! Por ahora el chat funciona sólo con mongo, ya no con filesystem

io.on("connection", async socket => {
    // Hago que se envíe el array actualizado de productos a todos los sockets cada vez que se conecta un socket (recordemos que al enviar el formulario el usuario va a una ruta y vuelve a la principal rápidamente. En ese caso es como si se hubiera conectado un nuevo socket, lo que provocaría que esta función se ejecute)
    io.emit("enviarProducts", await contenedorProductos.getAll())

    // socket.emit("enviarMensajes", mensajes) // Envío al usuario el array (que contiene todos los mensajes pasados) para que le muestre el historial de mensajes apenas se loguee

    socket.on("message", async documentoChat => { // Recibo los datos emitidos en chat.js
        await contenedorHistorialChats.save( documentoChat )

        let arrayChat = await contenedorHistorialChats.getAll()

        arrayChat = quitarNewObjetId(arrayChat)
        const mensajesNormalizados = nomalizarMensajes({ id: "mensajes", mensajes: arrayChat })

        io.emit("enviarMensajes", mensajesNormalizados) // Versión nueva
        // io.emit("enviarMensajes", mensajes) // Enviamos al io en vez de al socket para que el array llegue a todos los sockets (usuarios)
    })

    socket.on("autenticado", alias => {
        socket.broadcast.emit("newUserConnected", alias) // El brodcast hace que se envíe a todos menos al socket (usuario) que desencadena el evento
    })
})
