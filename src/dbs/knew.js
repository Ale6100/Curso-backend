import knex from "knex";
import __dirname from "../utils.js";

const sqliteOptions = {
    client: "sqlite3", // El cliente que utilizamos para almacenar
    connection: {
        filename: __dirname+"/DB/ecommerce.sqlite" // Donde se almacenan los datos
    },
    useNullAsDefault: true
}

const db = knex(sqliteOptions) // Conectamos knew con sqlite

try {
    let exist = await db.schema.hasTable("products")

    if (!exist) { // Si la tabla "products" no existe, la creamos
        await db.schema.createTable("products", table => {
            table.increments("id").primary() // Una columna será utilizada para almacenar ids como valor primario que se incrementarán sólos a medida que vayamos agregando filas
            table.string("title", 30).notNullable() // Otra será utilizada para almacenar títulos con 30 carácteres que no puedan ser nulos
            table.float("price").notNullable()
            table.string("image", 1024)
            table.string("description", 100)
            table.float("stock").notNullable()
            console.log("Tabla de productos creada!")
        })
    }
} catch(error) {
    console.log(error)
}

try {
    let exist = await db.schema.hasTable("messages")

    if (!exist) { // Si la tabla "products" no existe, la creamos
        await db.schema.createTable("messages", table => {
            table.increments("id").primary()
            table.string("user", 30)
            table.string("message", 1000)
            table.string("fecha", 30)
            table.string("hora", 30)
            console.log("Tabla de mensajes creada!")
        })
    }
} catch(error) {
    console.log(error)
}

export default sqliteOptions;
