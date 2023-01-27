class Cart {
    static get model() { // Nombre de la colección a manipular
        return "carts"
    }

    static get schema() { // Estructura que tendrá cada documento en mongo
        return {
            timestamp: {
                type: Number,
                required: true
            },
            contenedor: {
                type: Array,
                required: true
            }
        }
    }
}

export default Cart
