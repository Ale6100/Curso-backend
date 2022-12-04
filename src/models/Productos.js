import mongoose from "mongoose";

const collection = 'productos'; // Nombre de la colección a manipular
const schema = new mongoose.Schema({ // Estructura que tendrá cada documento
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    stock: {
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

const productsModel = mongoose.model(collection, schema);

export default productsModel;
