import ContenedorFS from "./Contenedor.js"
import ContenedorDeContenedoresFS from "./ContenedorDeContenedores.js"
import ContenedorMongo from "./ContenedorMongo.js"
import ContenedorDeContenedoresMongo from "./ContenedorDeContenedoresMongo.js";
import mongoose from 'mongoose';
import key from "../../keys/key.js" // key privada

// Cambiar el valor de la siguiente constante para utilizar el tipo de persistencia de datos deseado
const PERSISTENCIA = "MONGO" // Valores posibles: FILESYSTEM y MONGO

let Contenedor
let ContenedorDeContenedores

if (PERSISTENCIA === "FILESYSTEM") { // Según el valor de persistencia, utilizamos la base de datos local con filesystem, o la que está subida a MongoDB Cloud
    Contenedor = ContenedorFS
    ContenedorDeContenedores = ContenedorDeContenedoresFS
    
} else if (PERSISTENCIA === "MONGO") { // Me conecto a mi base de datos en MongoDB Cloud (debes crear la tuya si deseas replicar este procedimiento)
    Contenedor = ContenedorMongo
    ContenedorDeContenedores = ContenedorDeContenedoresMongo
    const password = key
    const database = "backend" // Si no existe, la crea
    const connection = mongoose.connect(`mongodb+srv://backendCoder:${password}@cluster1.typ6zn6.mongodb.net/${database}?retryWrites=true&w=majority`, error => {
        if (error) console.log(error);
        else console.log(`Base de mongo conectada. Database: ${database}`)
    })
} else {
    new Error("El valor de PERSISTENCIA debe ser FILESYSTEM o MONGO")
}

export { Contenedor, ContenedorDeContenedores } // Exportamos los contenedores de filesystem o mongo según corresponda
