import GenericRepository from "./GenericRepository.js";
import User from "../../dao/models/User.model.js";
import Dao from "../../dao/dao.js";

class UserRepository extends GenericRepository { // Crea el repositorio específico para usuario, pero que utilice los métodos del GenericRepository
    constructor(dao: Dao) {
        super(dao, User.model) // Al estar en el UserRepository, sabemos que nuestro modelo será User.model
    }
}

export default UserRepository
