import config from "../config/config.js"
import jwt from "jsonwebtoken"

const checkLogger = (req, res, next) => { // Se encarga de obtener la información del usuario actual, si es que está logueado
    const token = req.cookies[config.jwt.nameCookie]; // Si el usuario tiene la cookie de la sesión, la obtiene
    try {
        const user = jwt.verify(token, config.jwt.secret); // Descifra al usuario siempre y cuando el token de la cookie no haya vencido
        req.user = user; // Define req.user, para poder llamar al usuario actual en cualquier otro req que venga después 
    } catch (error) {
        null
    }
    next()
}

export default checkLogger
