import UserRepository from "./UserRepository.js";
import ProductRepository from "./ProductRepository.js";
import CartRepository from "./CartRepository.js";
import Dao from "../../dao/dao.js";

const dao = new Dao();

export const userService = new UserRepository(dao); // Creo y exporto los repositorios
export const productService = new ProductRepository(dao)
export const cartService = new CartRepository(dao)
