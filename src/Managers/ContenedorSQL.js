import knex from "knex";

// Esta clase crea un objeto que manipula un archivo sqlite3 con muchas tablas dentro. Dichas tablas contienen objetos (representados por filas) que pueden ser agregados, modificados, borrados y consultados

class ContenedorSQL {
    constructor(config, tabla) {
        this.knex = knex(config)
        this.table = tabla // Nombre de la tabla
    }

    async getAll() { // Trae todas las filas de la tabla
        try {
            return this.knex.select("*").from(this.table)
        } catch(error) {
            console.log(error)
        }
    }

    async save(objeto) { // Guarda un objeto (como fila) en la tabla
        try {
            return this.knex.insert(objeto).into(this.table)
        } catch(error) {
            console.log(error)
        }
    }

    async getById(id) { // Trae la fila correspondiente al id pasado como parámetro
        try {
            return this.knex.select("*").from(this.table).where("id", id)
        } catch(error) {
            console.log(error)
        }
    }

    async deleteById(id) { // Borra el objeto con este id
        try {
            return this.knex.delete().from(this.table).where("id", id)
        } catch(error) {
            console.log(error)
        }
    }

    async deleteAll() { // Borra todos los objetos
        try {
            return this.knex.delete().from(this.table)
        } catch(error) {
            console.log(error)
        }
    }

    async update(objeto, id) { // Reemplaza el objeto con este id por el nuevo pasado como parámetro
        try {
            return this.knex.from(this.table).where("id", id).update(objeto)
        } catch(error) {
            console.log(error)
        }
    }
}

export default ContenedorSQL
