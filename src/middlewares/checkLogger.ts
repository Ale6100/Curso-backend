import config from "../config/config.js"
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express";

const checkLogger = (req: Request, _res: Response, next: NextFunction) => { // Se encarga de obtener la información del usuario actual, si es que está logueado
    
    const token = config.jwt.nameCookie ? req.cookies[config.jwt.nameCookie] : "-" // Si el usuario tiene la cookie de la sesión, la obtiene
    const secret = config.jwt.secret ? config.jwt.secret : ""

    try {
        const user = jwt.verify(token, secret); // Descifra al usuario siempre y cuando el token de la cookie no haya vencido (da error si venció o si no se pasó ningún token)
        req.user = user; // Define req.user, para poder llamar al usuario actual en cualquier otro req que venga después 
    } catch (error) {
        null
    }
    next()
}

export default checkLogger
