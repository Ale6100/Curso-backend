import productsModel from "../models/Productos.js"
import chatModel from "../models/Chat.js"

const stringAleatorio = (n) => { // Devuelve un string aleatorio de longitud n
    const simbolos = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789¡!¿?@#$%&()+-=*,.;:_"
    let stringRandom = ""
    for (let i=1; i<=n; i++) {
        stringRandom += simbolos[parseInt(simbolos.length*Math.random())]
    }
    return stringRandom
}

// Esta clase crea un objeto que manipula una colección en MongoDB con documentos dentro. Dichos documentos pueden ser agregados, modificados, borrados y consultados

class Contenedor {
    constructor(nombreColeccion) {
        if (nombreColeccion === "productos") { // Analizo cuál modelo voy a utilizar, según sea el nombre de la colección que se haya pasado como parámetro
            this.model = productsModel
        } else if (nombreColeccion === "historialChats") {
            this.model = chatModel
        } else {
            throw new Error(`Alto! Te falta crear y/o importar el modelo de ${nombreColeccion}`)
        }
    }

    async getAll() { // Devuelve un array con todos los documentos presentes en la colección
        return await this.model.find({})
    }

    async saveOne(document) { // Recibe un documento, lo guarda en la colección, le coloca un id único y devuelve ese id
        document.timestamp = Date.now()
        document.code = stringAleatorio(10)
        const documentSaveModel = new this.model(document)
        const saveOne_ = await documentSaveModel.save()
        return saveOne_._id.valueOf()
    }

    async getById(id) { // Recibe un id y devuelve el documento con ese id, o null si no está
        const document = await this.model.find({_id: id})
        return document.length === 0 ? null : document
    }

    async deleteById(id) { // Elimina de la base de datos al documento con el id solicitado
        await this.model.deleteOne({_id: id})
    }

    async deleteAll() { // Vacía la colección
        await this.model.deleteMany({})
    }

    async update(documentoActualizado, id) { // Actualiza un documento de la colección según su id (reemplaza al anterior por el nuevo)
        await this.model.updateOne({_id: id}, {$set: {...documentoActualizado}})
    }
}

export default Contenedor
