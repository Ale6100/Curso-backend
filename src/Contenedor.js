import fs from "fs" // Trae el módulo local fs

class Contenedor {
    constructor(nombreDelArchivo) {
        this.nombre = nombreDelArchivo
    }

    async getAll() { // Devuelve un array con todos los objetos presentes en el archivo
        let datosArchivo = []
        if (fs.existsSync(`${this.nombre}.json`)) { // Si el archivo con el array de objetos existe, devuelve ese array
            datosArchivo = await fs.promises.readFile(`${this.nombre}.json`, "utf-8")
            datosArchivo = JSON.parse(datosArchivo)
        }
        return datosArchivo
    }
       
    async save(objeto) { // Recibe un objeto, lo guarda en el archivo y devuelve el id asignado
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
        await fs.promises.writeFile(`${this.nombre}.json`, datosArchivo) // Actualiza el archivo con el nuevo objeto agregado
        return idAAgregar // Retorna el id asignado
    }

    async getById(id) { // Recibe un id y devuelve el objeto con ese id, o null si no está
        const datosArchivo = await this.getAll()
        return datosArchivo.some(objeto => objeto.id === id) ? datosArchivo.find(objeto => objeto.id === id) : null
    }

    async deleteById(id) { // Elimina del archivo el objeto con el id buscado
        let datosArchivo = await this.getAll()
        datosArchivo = datosArchivo.filter(objeto => objeto.id !== id)
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        await fs.promises.writeFile(`${this.nombre}.json`, datosArchivo) // Actualiza el array en el archivo
    }

    async deleteAll() { // Vacía el array del archivo
        if (fs.existsSync(`${this.nombre}.json`)) {
            await fs.promises.writeFile(`${this.nombre}.json`, "[]")
        }
    }
}

export default Contenedor
