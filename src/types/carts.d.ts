export interface CartMongo { // Carrito en MongoDB
    _id: string,
    contenedor: {
        idProductInCart: string,
        quantity: number
    }[]
}

export interface CartSaveMongo {
    contenedor: []
}
