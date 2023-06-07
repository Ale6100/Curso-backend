import mongoose from "mongoose";
import config from "../config/config.js";
import logger from "../utils/logger.js";
import User from "./models/User.model.js" // Se deben importar todos los modelos a utilizar
import Product from "./models/Product.model.js"
import Cart from "./models/Cart.model.js";

class Dao {
    constructor() {
        this.connection = mongoose.connect(config.mongo.url, error => {
            if (error) logger.fatal(`${error.toString().replaceAll("\"", '\'')}`);
            else logger.info(`Base de mongo conectada`)
        })

        const genericTimeStamps = {timestamps: {createdAt: "created_at", updatedAt: "udated_at"}}

        // Creo todos los schemas 
        const userSchema = mongoose.Schema(User.schema, genericTimeStamps) // De la configuración de cada usuario, toma la estructura del schema y crea el schema, anexándole los timestamps
        const productSchema = mongoose.Schema(Product.schema, genericTimeStamps)
        const cartSchema = mongoose.Schema(Cart.schema, genericTimeStamps)

        this.models = {
            [User.model]: mongoose.model(User.model, userSchema), // A partir de las colecciones y schemas creados, crea los modelos
            [Product.model]: mongoose.model(Product.model, productSchema),
            [Cart.model]: mongoose.model(Cart.model, cartSchema)
        }
    }

    // Métodos base que se utilizarán para crear otros métodos, en los archivos de la carpeta "repositories"
    save = (document, entity) => { // Guarda un documento en una colección
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].create(document)
    }
    
    get = (options, entity) => { // Realiza un tipo de find definido en options, en la colección entity
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].find(options)
    }

    getBy = (options, entity) => {
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].findOne(options)
    }

    getByAndPopulate = (options, populationQuery, entity) => { // Obtiene un documento pero además aplica un populate()
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].findOne(options).populate(populationQuery)
    }

    updateBy = (reference, update, entity) => {
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].updateOne(reference, update)
    }

    deleteBy = (options, entity) => {
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].deleteOne(options)
    }
}

export default Dao

