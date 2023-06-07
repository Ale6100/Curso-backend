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
import checkPermissions from "./middlewares/checkPermissions.js";

const app = express();

const PORT = process.env.PORT || 8080; // Elige el puerto 8080 en caso de que no venga definido uno por defecto como variable de entorno. Recomiendo el 8080 ya que ahí tengo actualmente las imágenes de los productos

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
            description: "API para el uso de un ecommerce. Si deseas poner a prueba alguno de estos endpoints de manera manual desde aquí, debes loguearte como administrador desde el endpoint /api/sessions/login que encontrarás más abajo",
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

const confAuto = () => {
    app.use(cors(corsOptions([config.site.urlfrontend])))
}

const confManual = () => {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", config.site.urlfrontend);
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Credentials", true);
        next();
    });
}

const confOptions = () => {
    app.options("*", function(req, res) {
        res.header("Access-Control-Allow-Origin", config.site.urlfrontend);
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        res.header("Access-Control-Allow-Credentials", true);
        res.sendStatus(200);
    });
}

if (config.cors.auto === "true") {
    if (config.cors.manual === "true") {
        if (config.cors.options === "true") {
            logger.info("CORS AUTO, MANUAL Y OPTIONS")
            confAuto()
            confManual()
            confOptions() 
        } else {
            logger.info("CORS AUTO Y MANUAL")
            confAuto()
            confManual()
        }
    } else {
        logger.info("CORS AUTO Y OPTIONS")
        confAuto()
        confOptions() 
    }
} else {
    logger.info("CORS MANUAL Y OPTIONS")
    confManual()
    confOptions() 
}

if (config.cors.auto === "true" && config.cors.manual !== "true" && config.cors.options !== "true") {
    logger.info("CORS AUTO")
    confAuto()
} else if (config.cors.auto !== "true" && config.cors.manual === "true" && config.cors.options !== "true") {
    logger.info("CORS MANUAL")
    confManual()
} else if (config.cors.auto !== "true" && config.cors.manual !== "true" && config.cors.options === "true") {
    logger.info("CORS OPTIONS")
    confOptions()
}

logger.info(`AUTO: ${config.cors.auto}`)
logger.info(`MANUAL: ${config.cors.manual}`)
logger.info(`OPTIONS: ${config.cors.options}`)
logger.info("-----")

app.use(addLogger)
app.use(checkLogger)
app.use(checkPermissions)

app.use("/", baseRouter)
app.use("/api/products", productosRouter)
app.use("/api/carts", carritoRouter)
app.use("/api/sessions", sessionsRouter)
app.use("/api/payments", paymentsRouter)
app.use("/api-docs", swaggerUIExpress.serve, swaggerUIExpress.setup(specs)) // En /api-docs quiero que a partir de swaggerIUExpress se vea la documentación según la configuración que nos indicó specs

export { server }
