import mongoose from "mongoose";

const collection = 'users'; // Nombre de la colección a manipular
const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
    password: {
        type: String
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;
