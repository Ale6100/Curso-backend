import cartsModel from "./models/Carritos.js"

// Esta clase crea un objeto que manipula una colección en MongoDB con documentos dentro. Dicha colección contiene documentos que a su vez contienen un array "contenedor". Este array es el "contenedor de contenedores" ya que sus elementos son objetos que representan a otros contenedores (mediante sus ids). Estos últimos contenedores deben ser creados con la clase Contenedor que está en Contenedor.js
// Los contenedores (los elementos del array) pueden ser agregados, modificados, borrados y consultados

class ContenedorDeContenedores { // El nombre del archivo se pasa como parámetro
    constructor(nombreColeccion) {
        if (nombreColeccion === "carritos") { // Analizo cuál modelo voy a utilizar, según sea el nombre de la colección que se haya pasado como parámetro
            this.model = cartsModel
        } else {
            throw new Error(`Alto! Te falta crear y/o importar el modelo de ${nombreColeccion}`)
        }
    }

    async getAll() { // Devuelve un array con todos los documentos (tienen los contenedores que nos interesan) presentes en el archivo
        return await this.model.find({})
    }

    async save() { // Guarda un contenedor vacío. Le asigna un id único y devuelve ese id
        const newDocument = {
            timestamp: Date.now(),
            contenedor: []
        }
        const save_ = await this.model.create(newDocument)
        return save_._id.valueOf()
    }

    async getById(id) { // Recibe un id y devuelve el documento con ese id, o null si no está
        return await this.model.findOne({_id: id})
    }

    async saveContainerInContainer(idContGrande, idContChico) { // Guarda el id de un contendor dentro de otro. La propiedad quantity nos especifica cuántas veces el contenedor de adentro (que denomino "chico") está en el de afuera. Necesitamos el id de ambos para poder referenciarlos
        let document = await this.model.findOne({_id: idContGrande})
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
        await this.model.updateOne({_id: idContGrande}, {$set: {contenedor: productos}})
    }

    async deleteById(id) { // Vacía de la colección al contenedor grande con el id solicitado
        await this.model.updateOne({_id: id}, {$set: {contenedor: []}})
    }

    async deleteContainerInContainer(idContGrande, idContChico) { // Elimina un contenedor dentro de otro contenedor gracias a sus ids
        // await this.model.updateOne({_id: idContGrande}, {$set: {contenedor: {$nin: idContChico}}})
        let contenedorChicoBorrado = false
        let document = await this.model.findOne({_id: idContGrande})
        let productos = document.contenedor
        if (productos.some(producto => producto.id === idContChico)) { // Si el id del contenedor chico está dentro del grande, lo borra
            const indiceContChico = productos.findIndex(producto => producto.id === idContChico)
            productos.splice(indiceContChico, 1);
            contenedorChicoBorrado = true
        }
        await this.model.updateOne({_id: idContGrande}, {$set: {contenedor: productos}})
        return contenedorChicoBorrado
    }
}

export default ContenedorDeContenedores
