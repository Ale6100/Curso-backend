import mongoose from "mongoose";

const collection = 'users'; // Nombre de la colección a manipular
const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    role: {
        type: String,
        require: true,
        default: "user"
    },
    password: {
        type: Number,
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

const userModel = mongoose.model(collection, schema);

export default userModel;
