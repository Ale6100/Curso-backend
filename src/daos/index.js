import ContenedorFS from "./Contenedor.js"
import ContenedorDeContenedoresFS from "./ContenedorDeContenedores.js"
import ContenedorUsersFS from "./ContenedorUsers.js"

import ContenedorMongo from "./ContenedorMongo.js";
import ContenedorDeContenedoresMongo from "./ContenedorDeContenedoresMongo.js";
import ContenedorUsersMongo from "./ContenedorUsersMongo.js"
import mongoose from 'mongoose';
import config from "../config/config.js";
import { logger } from "../utils/logger.js";

// Cambiar el valor de la siguiente constante para utilizar el tipo de persistencia de datos deseado
const PERSISTENCIA = "MONGO" // Valores posibles: FILESYSTEM y MONGO

let Contenedor
let ContenedorDeContenedores
let ContenedorUsers

if (PERSISTENCIA === "FILESYSTEM") { // Según el valor de persistencia, utilizamos la base de datos local con filesystem, o la que está subida a MongoDB Cloud
    Contenedor = ContenedorFS
    ContenedorDeContenedores = ContenedorDeContenedoresFS
    ContenedorUsers = ContenedorUsersFS
    
} else if (PERSISTENCIA === "MONGO") { // Me conecto a mi base de datos en MongoDB Cloud (debes crear la tuya si deseas replicar este procedimiento)
    Contenedor = ContenedorMongo
    ContenedorDeContenedores = ContenedorDeContenedoresMongo
    ContenedorUsers = ContenedorUsersMongo
    const password = config.mongo.password
    const database = "backend" // Si no existe, la crea
    mongoose.connect(`mongodb+srv://backendCoder:${password}@cluster1.typ6zn6.mongodb.net/${database}?retryWrites=true&w=majority`, error => {
        if (error) logger.error(`${error.toString().replaceAll("\"", '\'')}`);
        else logger.info(`Base de mongo conectada. Database: ${database}`)
    })
} else {
    throw new Error("El valor de la constante PERSISTENCIA debe ser FILESYSTEM o MONGO")
}

export { Contenedor, ContenedorDeContenedores, ContenedorUsers } // Exportamos los contenedores de filesystem o mongo según corresponda
