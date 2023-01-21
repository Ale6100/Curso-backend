import mongoose from "mongoose";

const collection = "carritos"
const shema = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: true
    },
    contenedor: {
        type: Array,
        required: true
    }
})

const cartsModel = mongoose.model(collection, shema)

export default cartsModel
