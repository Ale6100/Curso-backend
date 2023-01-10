"use strict";

import express from "express";
import __dirname from "./utils.js";
import parseArgs from "minimist";
import cluster from "cluster"
import os from "os"
import randomsRouter from "./routes/randoms.routes.js"

const CPUs = os.cpus().length;

const app = express();

const PORT = process.env.PORT || 8080; // Elige el puerto 8080 en caso de que no tenga uno seteadp por defecto en la variable de entorno

app.use(express.json()); // Especifica que podemos recibir json
app.use(express.urlencoded({ extended: true })); // Habilita poder procesar y parsear datos más complejos en la url

app.use("/api/randoms", randomsRouter)

app.set("views", `${__dirname}/views`); // Ubicación de las vistas
app.set("view engine", "ejs"); // Configuramos EJS como el motor de visualización de nuestra app

const args = parseArgs(process.argv.slice(2), {
    default: {
        mode: "FORK" // Valores posibles: CLUSTER y FORK
    },
    alias: {
        mode: "MODE" // Al hacer esto, la propiedad "mode" va a tener una copia cuyo alias es MODE. No lo voy a usar, pero dejo constancia sobre cómo hacerlo por si en el futuro me sirve
    }
})

console.log("Argumentos", args)

app.get("/", async (req, res) => { // Renderiza formulario en la ruta "/" que sirve para cargar productos
    res.render("index", { pid: process.pid })
})

app.get("/info", async (req, res) => {
    console.log(`/info: Proceso ${process.pid}`);
    const info = {
        argumentosEntrada: JSON.stringify(args),
        sistemaOperativo: process.platform,
        versionNode: process.version,
        memoriaTotalReservada: process.memoryUsage(),
        pathEjecucion: __dirname,
        processId: process.pid,
        carpetaProyecto: process.cwd(),
        cantProcesadores: CPUs // Tomarlo con pinzas: https://stackoverflow.com/questions/23964511/requireos-cpus-length-returns-24-cant-understand-how
    }
    res.render("info", { info })
})

if (args.mode === "CLUSTER") {
    if (cluster.isPrimary) { // Si nos encontramos en el proceso primario
        console.log(`Ejecutando el servidor en modo ${args.mode}`)
        console.log(`Proceso primario con pid ${process.pid} ejecutándose`);
        
        for (let i = 0; i < CPUs; i++) { // Genera CPUs procesos hijos (o "workers") y vuelve a correr el archivo actual, entrando en el else. La cantidad depende de la computadora
            cluster.fork();
        }
        
        cluster.on('exit', (worker) => {
            console.log(`El proceso ${worker.process.pid} finalizó`)
            cluster.fork();  // Cuando un proceso hijo termina, inicia otro
        })
    } else {
        console.log(`Proceso worker con PID ${process.pid} ejecutándose`)
        const server = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`)); // Escuchamos en el puerto cada vez que se reconozca un nuevo proceso worker. Todos los procesos se comparten el mismo puerto
        server.on("error", error => console.log(error))
    }

} else if (args.mode === "FORK") {
    console.log(`Ejecutando el servidor en modo ${args.mode}`)
    console.log("El objetivo actual es verificar que nodemon crea un proceso extra forkeando al proceso padre");
    console.log(`Ejecuta el servidor con y sin Nodemon, en ambos casos escribe 'tasklist /fi "imagename eq node.exe"' en otra terminal y compara ambos casos, comprobando que nodemon crea un fork adicional`);
    const server = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`)); // Escuchamos en el puerto cada vez que se reconozca un nuevo proceso worker. Todos los procesos se comparten el mismo puerto
    server.on("error", error => console.log(error))
    
} else if (args.mode === "pm2") { // Cuando iniciamos con pm2
    console.log(`Ejecutando el servidor usando ${args.mode}`)
    const server = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`));
    server.on("error", error => console.log(error))

} else if (args.mode === "nginxDosPuertos") {
    if (cluster.isPrimary) { // Si nos encontramos en el proceso primario
        console.log(`Ejecutando el servidor usando ${args.mode}, creando un cluster de servidores escuchando en el puerto 8081 que, gracias a nginx, se encargaran de redirigir todas sus consultas a api/randoms, a excepción de la ruta 8080 que se encarga de escuchar las peticiones de las demás rutas`)
        console.log(`Proceso primario con pid ${process.pid} ejecutándose`);
        
        const server = app.listen(8080, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`)); // Escuchamos en el puerto cada vez que se reconozca un nuevo proceso worker. Todos los procesos se comparten el mismo puerto
        server.on("error", error => console.log(error))

        for (let i = 0; i < CPUs; i++) { // Genera CPUs procesos hijos (o "workers") y vuelve a correr el archivo actual, entrando en el else. La cantidad depende de la computadora
            cluster.fork();
        }
        
        cluster.on('exit', (worker) => {
            console.log(`El proceso ${worker.process.pid} finalizó`)
            cluster.fork();  // Cuando un proceso hijo termina, inicia otro
        })
        
    } else if (cluster.isWorker) {
        console.log(`Proceso worker con PID ${process.pid} ejecutándose`)
        const server = app.listen(8081, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`)); // Escuchamos en el puerto cada vez que se reconozca un nuevo proceso worker. Todos los procesos se comparten el mismo puerto
        server.on("error", error => console.log(error))
    }

} else if (args.mode === "nginxCincoPuertos") { // Cuando iniciamos con pm2
    console.log(`Ejecutando el servidor usando ${args.mode}, creando cuatro clusters de servidores con una instancia cada uno escuchando en el puerto    que se encargaran de redirigir todas sus consultas a api/randoms`)
    const server = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${server.address().port}`));
    server.on("error", error => console.log(error))

} else {
    throw new Error("Debes pasar un argumento en la consola indicando si deseas el modo cluster o el fork (para iniciar con pm2 se hace de otra manera). Ejemplo: node src/app.js --mode CLUSTER");
}
