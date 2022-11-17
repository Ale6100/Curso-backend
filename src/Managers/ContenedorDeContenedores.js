import fs from "fs"
import __dirname from "../utils.js"

// Esta clase crea un objeto que manipula un archivo json con un array dentro. Dicho array contiene objetos que a su vez contienen un array "contenedor". Este array es el "contenedor de contenedores" ya que sus elementos son objetos que representan a otros contenedores (mediante sus ids). Estos últimos contenedores deben ser creados con la clase Contenedor que está en Contenedor.js
// Los contenedores (los elementos del array del json) pueden ser agregados, modificados, borrados y consultados

class ContenedorDeContenedores { // El nombre del archivo se pasa como parámetro
    constructor(nombreDelArchivo) {
        this.nombre = nombreDelArchivo
        this.path = `${__dirname}/json/${this.nombre}.json` // Ruta al archivo donde se almacenan los datos
    }

    async getAll() { // Devuelve un array con todos los objetos (que tienen los contenedores que nos interesan) presentes en el archivo
        let datosArchivo = []
        if (fs.existsSync(this.path)) { // Si el archivo con el array de objetos existe, devuelve ese array
            datosArchivo = await fs.promises.readFile(this.path, "utf-8")
            datosArchivo = datosArchivo == "" ? [] : JSON.parse(datosArchivo) // Si el json existía pero estaba vacío (aunque jamás debería suceder), entonces nos quedamos con el array vacío. Sino, devolvemos el array con los elementos dentro
        }
        return datosArchivo
    }
    
    async save() { // Guarda un contenedor vacío. Le asigna un id único y devuelve ese id
        let datosArchivo = await this.getAll()
        const newContenedor = {
            timestamp: Date.now(),
            contenedor: [] // ENTREGA "Webpack: Module Bundler" DE BACKEND: En este trabajo el contenedor representa a un carrito, pero no lo nombro como tal porque trato de crear el código de la manera más general posible
        }
        if (datosArchivo.length === 0) {
            newContenedor.id = 1 // Queremos que el primer contenedor a agregar tenga id igual a 1
        
        } else {
            const obtenerIds = datosArchivo.map(objeto => objeto.id)
            newContenedor.id = Math.max(...obtenerIds) + 1
        }
        datosArchivo.push(newContenedor) // Agrega el objeto actualizado al array
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        await fs.promises.writeFile(this.path, datosArchivo) // Actualiza el archivo agregándole el nuevo contenedor
        return newContenedor.id // Retorna el id asignado
    }
    
    async getById(id) { // Recibe un id y devuelve el objeto con ese id, o null si no está
        const datosArchivo = await this.getAll()
        return datosArchivo.some(objeto => objeto.id === id) ? datosArchivo.find(contenedor => contenedor.id === id) : null
    }

    async saveContainerInContainer(idContGrande, idContChico) { // Guarda el id de un contendor dentro de otro. La propiedad quantity nos especifica cuantas veces el contenedor de adentro (que denomino "chico") está en el de afuera. Necesitamos el id de ambos para poder referenciarlos
        const datosArchivo = await this.getAll();
        let newDatosArchivo = datosArchivo.map( objeto => { // Modifica únicamente el contenedor de contenedores solicitado según su id
            if (objeto.id === idContGrande) {
                
                if (objeto.contenedor.some(producto => producto.id === idContChico)) { // Si el id del contenedor chico ya está dentro del grande, entonces sólo me concentro en aumentarle en 1 la cantidad
                    const nuevoContenedor = objeto.contenedor.map(producto => {
                        if (producto.id === idContChico) {
                            producto.quantity++
                        }
                        return producto
                    })
                    objeto.contenedor = nuevoContenedor

                } else { // Si el id del contenedor chico aún no estaba en el grande, entonces lo agrego 
                    objeto.contenedor.push({
                        "id": idContChico,
                        "quantity": 1
                    })
                }
            }
            return objeto
        })
        newDatosArchivo = JSON.stringify(newDatosArchivo, null, "\t")
        await fs.promises.writeFile(this.path, newDatosArchivo)
    }

    async deleteById(id) { // Vacía del archivo al contenedor con el id solicitado
        let datosArchivo = await this.getAll()
        let newDatosArchivo = datosArchivo.map(objeto => {
            if (objeto.id === id) {
                objeto.contenedor = []
            }
            return objeto
        })
        newDatosArchivo = JSON.stringify(newDatosArchivo, null, "\t")
        await fs.promises.writeFile(this.path, newDatosArchivo)
    }

    async deleteContainerInContainer (idContGrande, idContChico) { // Elimina un contenedor dentro de otro contenedor gracias a sus ids
        let contenedorChicoBorrado = false
        const datosArchivo = await this.getAll();
        let newDatosArchivo = datosArchivo.map( objeto => { // Modifica únicamente al contenedor de contenedores solicitado según su id
            if (objeto.id === idContGrande) {
                
                if (objeto.contenedor.some(producto => producto.id === idContChico)) { // Si el id del contenedor chico está dentro del grande, lo borra
                    const indiceContChico = objeto.contenedor.findIndex(producto => producto.id === idContChico)
                    objeto.contenedor.splice(indiceContChico, 1);
                    contenedorChicoBorrado = true
                }
            }
            return objeto
        })
        newDatosArchivo = JSON.stringify(newDatosArchivo, null, "\t")
        await fs.promises.writeFile(this.path, newDatosArchivo)
        return contenedorChicoBorrado
    }
}

export default ContenedorDeContenedores
