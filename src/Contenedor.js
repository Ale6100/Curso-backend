import fs from "fs" // Trae el módulo local fs
import __dirname from "./utils.js"

const direccion = (name) => `${__dirname}/json/${name}.json` // Ruta al archivo json donde se almacenan los datos

class Contenedor { // Estructura del objeto que manipula al archivo
    constructor(nombreDelArchivo) {
        this.nombre = nombreDelArchivo
    }

    async getAll() { // Devuelve un array con todos los objetos presentes en el archivo
        let datosArchivo = []
        if (fs.existsSync(direccion(this.nombre))) { // Si el archivo con el array de objetos existe, devuelve ese array
            datosArchivo = await fs.promises.readFile(direccion(this.nombre), "utf-8")
            datosArchivo = datosArchivo == "" ? [] : JSON.parse(datosArchivo) // Si el json existía pero estaba vacío, entonces nos quedamos con el array vacío. Sino, devolvemos el array con los elementos dentro
        }
        return datosArchivo
    }
       
    async save(objeto) { // Recibe un objeto, lo guarda en el archivo y devuelve el id asignado
        objeto.price = objeto.price == undefined ? undefined : parseFloat(objeto.price) // Me aseguro de que la propiedad "price" sea un número, siempre y cuando la propiedad esté definida
        let datosArchivo = await this.getAll()
        let idAAgregar        
        if (datosArchivo.length === 0) { // El propósito de este if-else es asegurar que el id agregado es único en el array
            idAAgregar = 1 // Define a esta variable como 1 ya que queremos que el primer objeto tenga id igual a 1
        } else {
            idAAgregar = datosArchivo[datosArchivo.length-1].id + 1 // Los siguientes objetos tendrán un id igual al id del último objeto del array+1
        }
        objeto.id = idAAgregar // Le agrega al objeto el id mencionado
        datosArchivo.push(objeto) // y luego agrega el objeto actualizado al array
        datosArchivo = JSON.stringify(datosArchivo, null, "\t") // Pasa el array a formato json
        await fs.promises.writeFile(direccion(this.nombre), datosArchivo) // Actualiza el archivo con el nuevo objeto agregado
        return idAAgregar // Retorna el id asignado
    }

    async getById(id) { // Recibe un id y devuelve el objeto con ese id, o null si no está
        const datosArchivo = await this.getAll()
        return datosArchivo.some(objeto => objeto.id === id) ? datosArchivo.find(objeto => objeto.id === id) : null
    }

    async deleteById(id) { // Elimina del archivo el objeto con el id buscado
        let datosArchivo = await this.getAll()
        datosArchivo = datosArchivo.filter(objeto => objeto.id != id)
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        await fs.promises.writeFile(direccion(this.nombre), datosArchivo) // Actualiza el array en el archivo
    }

    async deleteAll() { // Vacía el array del archivo
        if (fs.existsSync(direccion(this.nombre))) {
            await fs.promises.writeFile(direccion(this.nombre), "[]")
        }
    }

    async update(objetoActualizado, id) { // Actualiza el objeto en el archivo según su id
        let datosArchivo = await this.getAll()
        const indiceObjeto = datosArchivo.findIndex(objeto => objeto.id == id)
        objetoActualizado.id = id
        datosArchivo[indiceObjeto] = objetoActualizado
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        await fs.promises.writeFile(direccion(this.nombre), datosArchivo)
    }
}

export default Contenedor
