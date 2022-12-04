import mongoose from "mongoose";

const collection = 'historialChats'; // Nombre de la colección a manipular
const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    user: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    fecha: {
        type: String,
        require: true
    },
    hora: {
        type: String,
        require: true
    },
    timestamp: {
        type: Number,
        require: true
    },
    code: {
        type: String,
        require: true
    }
})

const chatModel = mongoose.model(collection, schema);

export default chatModel;
