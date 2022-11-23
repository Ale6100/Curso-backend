import fs from "fs" // Trae el módulo local fs
import __dirname from "../utils.js"

const stringAleatorio = (n) => { // Devuelve un string aleatorio de longitud n
    const simbolos = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789¡!¿?@#$%&()+-=*,.;:_"
    let stringRandom = ""
    for (let i=1; i<=n; i++) {
        stringRandom += simbolos[parseInt(simbolos.length*Math.random())]
    }
    return stringRandom
}

// Esta clase crea un objeto que manipula un archivo json con un array dentro. Dicho array contiene objetos que pueden ser agregados, modificados, borrados y consultados

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
        objeto.timestamp = Date.now()
        objeto.code = stringAleatorio(10)
        datosArchivo.push(objeto) // Agrega el objeto actualizado al array
        datosArchivo = JSON.stringify(datosArchivo, null, "\t") // Pasa el array a formato json
        await fs.promises.writeFile(this.path, datosArchivo) // Actualiza el archivo agregándole el nuevo objeto
        return objeto.id // Retorna el id asignado
    }

    async getById(id) { // Recibe un id y devuelve el objeto con ese id, o null si no está
        const datosArchivo = await this.getAll()
        return datosArchivo.some(objeto => objeto.id === id) ? datosArchivo.find(objeto => objeto.id === id) : null
    }

    async deleteById(id) { // Elimina del archivo el objeto con el id buscado
        let datosArchivo = await this.getAll()
        datosArchivo = datosArchivo.filter(objeto => objeto.id != id)
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        await fs.promises.writeFile(this.path, datosArchivo)
    }

    async deleteAll() { // Vacía el array del archivo
        if (fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, "[]")
        }
    }

    async update(objetoActualizado, id) { // Actualiza un objeto en el archivo según su id (reemplaza el anterior por el nuevo)
        let datosArchivo = await this.getAll()
        const indiceObjeto = datosArchivo.findIndex(objeto => objeto.id == id)
        objetoActualizado.id = parseInt(id)
        objetoActualizado.code = datosArchivo.find(objeto => objeto.id == id).code // La propiedad code debe ser la misma que antes ya que es un identificador, al igual que el id
        datosArchivo[indiceObjeto] = objetoActualizado
        datosArchivo = JSON.stringify(datosArchivo, null, "\t")
        await fs.promises.writeFile(this.path, datosArchivo)
    }
}

export default Contenedor
