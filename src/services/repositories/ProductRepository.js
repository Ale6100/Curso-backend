import GenericRepository from "./GenericRepository.js";
import Product from "../../dao/models/Product.model.js";

class ProductRepository extends GenericRepository {
    constructor(dao) {
        super(dao, Product.model)
    }
}

export default ProductRepository

