import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";
import { UserMongo } from "./types/users"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const createHash = async (password: string) => { // Hashea una contraseña
    const salts = await bcrypt.genSalt(10) // Genera una "sal" aleatoria de 10 rondas
    return bcrypt.hash(password, salts) // Combina la contraseña con la sal generada y devuelve una nueva contraseña hasheada que es más segura que la original
}

export const validatePassword = (user: UserMongo, password: string) => { // Devuelve true si colocamos una contraseña correcta en el logueo
    return bcrypt.compare(password, user.password) // Compara la contraseña en el formulario de logueo contra la contraseña hasheada
}

export const waitFor = (time: number): Promise<void> => { // Hace que tu código asincrónico espere un tiempo (en milisegundos) que le pases como parámetro antes de continuar la ejecución
    return new Promise(resolve => setTimeout(resolve, time))
}

export default __dirname;
