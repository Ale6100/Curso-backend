import mongoose from "mongoose";
import config from "../config/config.js";
import logger from "../utils/logger.js";
import User from "./models/User.model.js" // Se deben importar todos los modelos a utilizar
import Product from "./models/Product.model.js"
import Cart from "./models/Cart.model.js";
import { DeleteMongo, GetMongo, PosibleModels, PostMongo, ReferenceUpdateBy } from "../types/types.js";
import { waitFor } from "../utils.js";

class Dao {
    public connection: any // No importa el tipo de dato de connection
    public models: { [K in PosibleModels]: mongoose.Model<any> }; // Pido que models sea un objeto cuyas claves sólo puedan ser los valores de PosibleModels

    constructor() {
        this.connection = this.connect();
        
        const genericTimeStamps = {timestamps: {createdAt: "created_at", updatedAt: "updated_at"}}

        // Creo todos los schemas 
        const userSchema = new mongoose.Schema(User.schema, genericTimeStamps) // De la configuración de cada usuario, toma la estructura del schema y crea el schema, anexándole los timestamps
        const productSchema = new mongoose.Schema(Product.schema, genericTimeStamps)
        const cartSchema = new mongoose.Schema(Cart.schema, genericTimeStamps)

        this.models = {
            [User.model]: mongoose.model(User.model, userSchema), // A partir de las colecciones y schemas creados, crea los modelos
            [Product.model]: mongoose.model(Product.model, productSchema),
            [Cart.model]: mongoose.model(Cart.model, cartSchema)
        }
    }

    private async connect() {
        try {
            await mongoose.connect(config.mongo.url);
            logger.info(`Base de mongo conectada`);
        } catch (error) {
            logger.fatal(error);
            await waitFor(750);
            throw new Error(`${error}`)
        }
    }

    // Métodos base que se utilizarán para crear otros métodos, en los archivos de la carpeta "repositories"
    save = (document: PostMongo, entity: PosibleModels) => { // Guarda un documento en una colección
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].create(document)
    }
    
    get = (entity: PosibleModels, options?: any) => { // Realiza un tipo de find definido en options, en la colección entity
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].find(options)
    }

    getBy = (options: GetMongo, entity: PosibleModels) => {
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].findOne(options)
    }

    getByAndPopulate = (options: any, populationQuery: any, entity: PosibleModels) => { // Obtiene un documento pero además aplica un populate()
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].findOne(options).populate(populationQuery)
    }

    updateBy = (reference: ReferenceUpdateBy, update: any, entity: PosibleModels) => {
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].updateOne(reference, update)
    }

    deleteBy = (options: DeleteMongo, entity: PosibleModels) => {
        if (!this.models[entity]) throw new Error(`Entity ${entity} not defined in models`)
        return this.models[entity].deleteOne(options)
    }
}

export default Dao
