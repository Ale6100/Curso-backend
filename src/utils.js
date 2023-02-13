import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = async (password) => { // Hashea una contraseña
    const salts = await bcrypt.genSalt(10) // Genera una "sal" aleatoria de 10 rondas
    return bcrypt.hash(password, salts) // Combina la contraseña con la sal generada y devuelve una nueva contraseña hasheada que es más segura que la original
}

export const validatePassword = (user, password) => { // Devuelve true si colocamos una contraseña correcta en el logueo
    return bcrypt.compare(password, user.password) // Compara la contraseña en el formulario de logueo contra la contraseña hasheada
}

export default __dirname;
