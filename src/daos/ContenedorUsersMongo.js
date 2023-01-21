import usersModel from "./models/User.js"

class Contenedor {
    constructor(nombreColeccion) {
        if (nombreColeccion === "users") {
            this.model = usersModel
        } else {
            throw new Error(`Alto! Te definir el nombre de la coleccion de ${nombreColeccion}`)
        }
    }

    async save(document) { // Recibe un documento, lo guarda en la colección, le coloca un id único y devuelve ese id
        const save_ = await this.model.create(document)
        return save_._id.valueOf()
    }

    async getById({email, id}) { //  Recibe un email o un id como propiedad de un objeto y devuelve el documento con esa propiedad, o null si no está
        let document
        if (email) {
            document = await this.model.findOne({ email })
        } else if (id) {
            document = await this.model.findOne({ _id: id })
        } else {
            throw new Error(`Alto! No pasaste ningún parámetro en el método getById`)
        }
        
        return document
    }
}

export default Contenedor
