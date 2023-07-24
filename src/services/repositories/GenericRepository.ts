import Dao from "../../dao/dao.js"
import { PosibleModels, GetMongo, PostMongo, ReferenceUpdateBy, DeleteMongo } from "../../types/types.js"

class GenericRepository {
    public model: PosibleModels
    public dao: Dao

    constructor(dao: Dao, model: PosibleModels) { // Se podrá construir un repositorio genérico a partir de un dao y model
        this.dao = dao
        this.model = model
    }

    // Métodos que estarán en todos los repositorios
    save = (document: PostMongo) => this.dao.save(document, this.model)

    getAll = (params?: any) => this.dao.get(this.model, params) // Accede al método get del dao, y el modelo con el que se instanció el repositorio
    
    getBy = (params: GetMongo) => this.dao.getBy(params, this.model)

    updateBy = (reference: ReferenceUpdateBy, update: any) => this.dao.updateBy(reference, update, this.model)

    deleteBy = (params: DeleteMongo): any => this.dao.deleteBy(params, this.model)
}

export default GenericRepository
