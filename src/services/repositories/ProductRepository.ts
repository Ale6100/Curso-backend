import GenericRepository from "./GenericRepository.js";
import Product from "../../dao/models/Product.model.js";
import Dao from "../../dao/dao.js";

class ProductRepository extends GenericRepository {
    constructor(dao: Dao) {
        super(dao, Product.model)
    }
}

export default ProductRepository
