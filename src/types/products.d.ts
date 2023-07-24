export interface ProductSaveMongo { // Producto que se guardará en MongoDB
    title: string,
    description: string,
    image: string,
    price: number,
    stock: number
}

export interface ProductMongo extends ProductSaveMongo { // Producto que se guardará en MongoDB
    _id: string
}
