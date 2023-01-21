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

    password: {
        type: String,
        required: true,
    },

    direccion: {
        type: String,
        required: true,
    },

    age: {
        type: Number,
        required: true, 
    },

    phone: {
        type: String,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },

    cartId: { // Cada usuario tiene un carrito asociado
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
        default: "user"
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;
