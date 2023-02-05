import GenericRepository from "./genericRepository.js";
import Cart from "../../dao/models/Cart.model.js";

class CartRepository extends GenericRepository {
    constructor(dao) {
        super(dao, Cart.model)
    }

    async saveContainerInContainer(idContGrande, idContChico) { // Guarda el id de un contendor dentro de otro. La propiedad quantity nos especifica cuántas veces el contenedor de adentro (que denomino "chico") está en el de afuera. Necesitamos el id de ambos para poder referenciarlos
        let document = await this.getBy({_id: idContGrande})
        let productos = document.contenedor
        
        if (productos.some(producto => producto.id === idContChico)) { // Si el contenedor pequeño ya estaba dentro del grande, le suma la cantidad
            productos = productos.map(prod => {
                if (prod.id === idContChico){
                    prod.quantity++
                }
                return prod
            })
        } else { // Si no estaba, lo agrega mediante una referencia id y una cantidad
            productos.push({
                id: idContChico,
                quantity: 1
            })
        }
        await this.updateBy({_id: idContGrande}, {$set: {contenedor: productos}})
    }

    async deleteContainerInContainer(idContGrande, idContChico) { // Elimina un contenedor dentro de otro contenedor gracias a sus ids
        // await this.model.updateOne({_id: idContGrande}, {$set: {contenedor: {$nin: idContChico}}})
        let contenedorChicoBorrado = false
        let document = await this.getBy({_id: idContGrande})
        let productos = document.contenedor
        if (productos.some(producto => producto.id === idContChico)) { // Si el id del contenedor chico está dentro del grande, lo borra
            const indiceContChico = productos.findIndex(producto => producto.id === idContChico)
            productos.splice(indiceContChico, 1);
            contenedorChicoBorrado = true
        }
        await this.updateBy({_id: idContGrande}, {$set: {contenedor: productos}})
        return contenedorChicoBorrado
    }

    async deleteCartById(id) {
        await this.updateBy({_id: id}, {$set: {contenedor: []}})
    }
}

export default CartRepository
