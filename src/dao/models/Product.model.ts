import { Models } from "../../types/types"

class Product {
    static get model(): Models["product"] { // Nombre de la colección a manipular
        return "products"
    }

    static get schema() { // Estructura que tendrá cada documento en mongo
        return {
            title: {
                type: String,
                required: true,
                unique: true
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
            }
        }
    }
}

export default Product
