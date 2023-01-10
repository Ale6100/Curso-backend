import mongoose from "mongoose";

const collection = 'historialChats'; // Nombre de la colección a manipular
const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    author: {
        id: { // El "id" en realidad va a ser el mail
            type: String,
            required: true
        },
        nombre: {
            type: String,
            required: true
        },
        apellido: {
            type: String,
            required: true
        },
        edad: {
            type: String,
            required: true
        },
        alias: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    },
    text: {
        type: String,
        required: true
    }
})

const chatModel = mongoose.model(collection, schema);

export default chatModel;
