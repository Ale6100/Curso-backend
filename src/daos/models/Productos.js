import mongoose from "mongoose";

const collection = 'productos'; // Nombre de la colección a manipular
const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true
    }
})

const productsModel = mongoose.model(collection, schema);

export default productsModel;
