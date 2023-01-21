import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = async (password) => { // Hashea una contraseña
    const salts = await bcrypt.genSalt(10) // A partir de una cierta cantidad rondas, creamos un modelo que agarre una contraseña y la mezcle con cadenas aleatorias
    return bcrypt.hash(password, salts) // Genera una contraseña nueva
}

export const validatePassword = (user, password) => { // Devuelve true si colocamos una contraseña correcta en el logueo
    return bcrypt.compare(password, user.password) // Compara la contraseña en el formulario de logueo contra la contraseña hasheada
}

export default __dirname;
