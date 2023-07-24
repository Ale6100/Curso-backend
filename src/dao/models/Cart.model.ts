import mongoose from "mongoose"
import { Models } from "../../types/types"

class Cart {
    static get model(): Models["cart"] { // Nombre de la colección a manipular
        return "carts"
    }

    static get schema() { // Estructura que tendrá cada documento en Mongo
        return {
            contenedor: [
                {
                    idProductInCart: {
                        type: mongoose.SchemaTypes.ObjectId,
                        ref: "products", // Se tiene que llamar igual que la colección donde se guardan los productos, para después traer (poblar) los demás productos usando esta referencia
                        required: true
                    },
                    quantity: {
                        type: Number,
                        required: true
                    }
                }
            ]
        }
    }
}

export default Cart
