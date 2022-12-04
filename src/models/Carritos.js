import mongoose from "mongoose";

const collection = "carritos"
const shema = new mongoose.Schema({
    timestamp: {
        type: Number,
        require: true
    },
    contenedor: {
        type: Array,
        require: true
    }
})

const cartsModel = mongoose.model(collection, shema)

export default cartsModel
