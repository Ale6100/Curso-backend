"use strict";

import express from "express";
import productosRouter from "./routes/productos.routes.js";
import __dirname from "./utils.js";
import baseRouter from "./routes/base.routes.js"
import carritoRouter from "./routes/carrito.routes.js"
import sessionsRouter from "./routes/sessions.routes.js"
import logger from "./utils/logger.js";
import os from "os"
import parseArgs from "minimist";
import cluster from "cluster"
import addLogger from "./middlewares/addLogger.js";
import checkLogger from "./middlewares/checkLogger.js";
import cors from "cors"
import corsOptions from "./middlewares/cors.js";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express"
import paymentsRouter from "./routes/payments.routes.js"
import config from "./config/config.js";

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
    server = app.listen(PORT, () => logger.info(`Servidor escuchando en el puerto ${server.address().port}`));
    server.on("error", error => logger.error(`${error}`))

} else {
    const error = "Debes pasar un argumento válido en la terminal indicando si deseas iniciar el servidor en modo FORK o CLUSTER. Ejemplo: node src/app.js --mode FORK"
    logger.error(`${error}`)
    setTimeout(() => {throw new Error(`${error}`)}, 1000); // Para que el logger funcione necesito ejecutar el error un poco después
}

const swaggerOptions = {
    definition: { // Definición general de nuestra API
        openapi: "3.0.1",
        info: {
            title: "Documentación Backend",
            description: "API para el uso de un ecommerce"
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`] // Permite que todos los archivos yaml de todas las carpetas de docs sirvan para la documentación
}

const specs = swaggerJSDoc(swaggerOptions)

app.set("views", `${__dirname}/views`); // Ubicación de las vistas
app.set("view engine", "ejs"); // Configuramos EJS como el motor de visualización de nuestra app

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url
app.use(cookieParser());

app.use(express.static(__dirname + "/public")); // Quiero que mi servicio de archivos estáticos se mantenga en public

app.use(addLogger)
app.use(checkLogger)

app.use(cors(corsOptions([config.site.urlfrontend])))

app.use("/", baseRouter)
app.use("/api/products", productosRouter)
app.use("/api/carts", carritoRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/payments", paymentsRouter)
app.use("/api-docs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs)) // En /api-docs quiero que a partir de swaggerIUExpress se vea la documentación según la configuración que nos indicó specs

app.all("*", (req, res) => { // El asterisco representa cualquier ruta que no esté definida
    if (!req.url.includes("/favicon.ico")) req.logger.warn(`${req.infoPeticion} | El método no está configurado para esta ruta`)
    res.status(404).send({ status: "error", error: "Error 404; Not Found"})
})

export { server }
