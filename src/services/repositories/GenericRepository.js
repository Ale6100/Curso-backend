class GenericRepository {
    constructor(dao, model) { // Se podrá construir un repositorio genérico a partir de un dao y model
        this.dao = dao
        this.model = model
    }

    // Métodos que estarán en todos los repositorios
    save = (document) => this.dao.save(document, this.model)

    getAll = (params) => this.dao.get(params, this.model) // Accede al método get del dao, y el modelo con el que se instanció el repositorio
    
    getBy = (params) => this.dao.getBy(params, this.model)

    updateBy = (reference, update) => this.dao.updateBy(reference, update, this.model)

    deleteBy = (params) => this.dao.deleteBy(params, this.model)
}

export default GenericRepository
