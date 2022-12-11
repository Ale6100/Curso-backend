import mongoose from "mongoose";

const collection = 'historialChats'; // Nombre de la colección a manipular
const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    author: {
        id: { // El "id" en realidad va a ser el mail. Entiendo que Mongo ya proporciona un id, pero según entendí en el ejercicio pide que hagamos esto
            type: String,
            require: true
        },
        nombre: {
            type: String,
            require: true
        },
        apellido: {
            type: String,
            require: true
        },
        edad: {
            type: String,
            require: true
        },
        alias: {
            type: String,
            require: true
        },
        avatar: {
            type: String,
            require: true
        }
    },
    text: {
        type: String,
        require: true
    }
})

const chatModel = mongoose.model(collection, schema);

export default chatModel;
