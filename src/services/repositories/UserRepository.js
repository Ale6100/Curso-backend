import GenericRepository from "./genericRepository.js";
import User from "../../dao/models/User.model.js";

class UserRepository extends GenericRepository { // Crea el repositorio específico para usuario, pero que utilice los métodos del GenericRepository
    constructor(dao) {
        super(dao, User.model) // Al estar en el UserRepository, sabemos que nuestro modelo será User.model
    }
}

export default UserRepository
