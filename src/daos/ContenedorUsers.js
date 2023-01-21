import fs from "fs" // Trae el módulo local fs
import __dirname from "../utils.js"

class Contenedor {
    constructor(nombreDelArchivo) { // El nombre del archivo se pasa como parámetro
        this.nombre = nombreDelArchivo
        this.path = `${__dirname}/json/${this.nombre}.json` // Ruta al archivo donde se almacenan los datos
    }

    async getAll() { // Devuelve un array con todos los objetos presentes en el archivo
        let datosArchivo = []
        if (fs.existsSync(this.path)) { // Si el archivo con el array de objetos existe, devuelve ese array
            datosArchivo = await fs.promises.readFile(this.path, "utf-8")
            datosArchivo = datosArchivo === "" ? [] : JSON.parse(datosArchivo) // Si el json existía pero estaba vacío (aunque jamás debería suceder), entonces nos quedamos con el array vacío. Sino, devolvemos el array con los elementos dentro
        }
        return datosArchivo
    }

    async save(objeto) { // Recibe un objeto, lo guarda en el archivo, le coloca un id único y devuelve ese id
        let datosArchivo = await this.getAll()
        if (datosArchivo.length === 0) { // El propósito de este if-else es asegurar que el id agregado es único en el array
            objeto.id = 1 // Queremos que el primer objeto a agregar tenga id igual a 1
        
        } else {
            const obtenerIds = datosArchivo.map(objeto => objeto.id)
            objeto.id = Math.max(...obtenerIds) + 1  // Los siguientes objetos tendrán un id igual al id de objeto más grande del array+1
        }
        datosArchivo.push(objeto) // Agrega el objeto actualizado al array
        datosArchivo = JSON.stringify(datosArchivo, null, "\t") // Pasa el array a formato json
        await fs.promises.writeFile(this.path, datosArchivo) // Actualiza el archivo agregándole el nuevo objeto
        return objeto.id // Retorna el id asignado
    }

    async getById({email, id}) { // Recibe un email o un id como propiedad de un objeto y devuelve el objeto con esa propiedad, o null si no está
        const datosArchivo = await this.getAll()
        id = parseInt(id)
        
        if (id) {
            return datosArchivo.some(objeto => objeto.id === id) ? datosArchivo.find(objeto => objeto.id === id) : null
        } else if (email) {
            return datosArchivo.some(objeto => objeto.email === email) ? datosArchivo.find(objeto => objeto.email === email) : null
        }
    }
}

export default Contenedor
