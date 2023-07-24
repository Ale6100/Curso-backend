import GenericRepository from "./GenericRepository.js";
import Cart from "../../dao/models/Cart.model.js";
import Dao from "../../dao/dao.js";
import { CartMongo } from "../../types/carts.js";

class CartRepository extends GenericRepository {
    constructor(dao: Dao) {
        super(dao, Cart.model)
    }

    async saveContainerInContainer(cartId: string, productId: string, cant: number) { // Guarda el id de un producto dentro de un carrito, "cant" cantidad de veces. La propiedad quantity nos especifica cuántas veces un producto está en el carrito. Necesitamos el id de ambos para poder referenciarlos. Devuelve el producto actualizado
        let document = await this.getBy({_id: cartId}) as CartMongo
        let productos = document.contenedor
        let updatedProduct

        if (productos.some(producto => producto.idProductInCart.valueOf() === productId)) { // Si el producto ya estaba en el carrito, le suma la cantidad
            productos = productos.map(prod => {
                if (prod.idProductInCart.valueOf() === productId){
                    prod.quantity += cant
                    updatedProduct = prod
                }
                return prod
            })
        } else { // Si no estaba, lo agrega mediante una referencia id y una cantidad
            updatedProduct = { idProductInCart: productId, quantity: cant }
            productos.push(updatedProduct)
        }
        await this.updateBy({_id: cartId}, {$set: {contenedor: productos}})
        return updatedProduct
    }

    async deleteContainerInContainer(cartId: string, productId: string) { // Elimina un producto dentro de un carrito gracias a sus ids
        let productoBorrado = false
        let document = await this.getBy({_id: cartId}) as CartMongo
        let productos = document.contenedor

        if (productos.some(producto => producto.idProductInCart.valueOf() === productId)) {
            const productIndex = productos.findIndex(producto => producto.idProductInCart.valueOf() === productId)
            productos.splice(productIndex, 1);
            productoBorrado = true
        }
        await this.updateBy({_id: cartId}, {$set: {contenedor: productos}})
        return productoBorrado
    }

    getByAndPopulate = (options: any) => {
        return this.dao.getByAndPopulate(options, {
            path: "contenedor", // Propiedad que quiero poblar (debe llamarse igual que el array del Cart.model.js que queremos llenar)
            populate: { // Dentro del contenedor también quiero que se haga otro "populate" tomando como referencia el products de Cart.model.js
                path: "idProductInCart"
            }
        }, Cart.model)
    }

    async deleteCartById(id: string) {
        await this.updateBy({_id: id}, {$set: {contenedor: []}})
    }
}

export default CartRepository
