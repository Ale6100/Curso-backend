"use strict";

import express from "express";
import productosRouter from "./routes/productos.routes.js";
import __dirname from "./utils.js";
import baseRouter from "./routes/base.routes.js"
import carritoRouter from "./routes/carrito.routes.js"
import formUsersRouter from "./routes/views.formUsers.routes.js"
import sessionsRouter from "./routes/sessions.routes.js"
import randomsRouter from "./routes/randoms.routes.js"
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import config from "./config/config.js";
import logger from "./utils/logger.js";
import os from "os"
import parseArgs from "minimist";
import cluster from "cluster"
import { addLogger } from "./middlewares/addLogger.js";

const app = express();

const PORT = process.env.PORT || 8080; // Elige el puerto 8080 en caso de que no venga definido uno por defecto como variable de entorno

const args = parseArgs(process.argv.slice(2), { default: { mode: "FORK" } }) // Valores posibles: CLUSTER y FORK. Por defecto se ejecuta el modo fork

const CPUs = os.cpus().length;

let server
if (args.mode === "CLUSTER") {
    if (cluster.isPrimary) { // Si nos encontramos en el proceso primario
        logger.info(`Ejecutando el servidor en modo ${args.mode}`)
        logger.info(`Proceso primario con pid ${process.pid} ejecutándose`);
        
        for (let i = 0; i < CPUs; i++) { // Genera CPUs procesos hijos (o "workers") y vuelve a correr el archivo actual, entrando en el else. La cantidad depende de la computadora
            cluster.fork();
        }
        
        cluster.on('exit', (worker) => {
            logger.info(`El proceso ${worker.process.pid} finalizó`)
            cluster.fork();  // Cuando un proceso hijo termina, inicia otro
        })
    } else {
        logger.info(`Proceso worker con PID ${process.pid} ejecutándose`)
        server = app.listen(PORT, () => logger.info(`Servidor escuchando en el puerto ${server.address().port}`)); // Escuchamos en el puerto cada vez que se reconozca un nuevo proceso worker. Todos los procesos se comparten el mismo puerto
        server.on("error", error => logger.error(`${error}`))
    }

} else if (args.mode === "FORK") { 
    logger.info(`Ejecutando el servidor en modo ${args.mode}`)
    server = app.listen(PORT, () => logger.info(`Servidor escuchando en el puerto ${server.address().port}`)); // Escuchamos en el puerto cada vez que se reconozca un nuevo proceso worker. Todos los procesos se comparten el mismo puerto
    server.on("error", error => logger.error(`${error}`))

} else {
    const error = "Debes pasar un argumento válido en la terminal indicando si deseas iniciar el servidor en modo FORK o CLUSTER. Ejemplo: node src/app.js --mode CLUSTER"
    logger.error(`${error}`)
    setTimeout(() => {throw new Error(`${error}`)}, 1000); // Para que el logger funcione necesito ejecutar el error un poco después
}

app.set("views", `${__dirname}/views`); // Ubicación de las vistas
app.set("view engine", "ejs"); // Configuramos EJS como el motor de visualización de nuestra app

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use(express.static(__dirname + "/public")); // Quiero que mi servicio de archivos estáticos se mantenga en public

app.use(addLogger)

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

app.use("/", baseRouter)
app.use("/api/products", productosRouter) // Ruta donde se carga y se visualizan productos con Postman
app.use("/api/cart", carritoRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/randoms", randomsRouter)
app.use("/formUsers", formUsersRouter)

app.all("*", (req, res) => { // El asterisco representa cualquier ruta que no esté definida
    req.logger.warn(`${req.infoPeticion} | El método no está configurado para esta ruta`)
    res.status(404).send({ status: "error", error: "Error 404; Not Found"})
})

export { server }
