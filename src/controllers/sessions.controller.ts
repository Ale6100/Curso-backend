import UserDto from "../dao/DTO/User.dto.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { userService, cartService } from "../services/repositories/services.js"
import sendMail from "../services/mailingService.js";
import { createHash, validatePassword } from "../utils.js";
import { Request, Response } from "express";
import { Email } from "../types/types.js";

const register = async (req: Request, res: Response) => { // En /api/sessions/register con el método POST, registra a un usuario en la base de datos
    try {
        const { first_name, last_name, direccion, date, phone, email, password } = req.body;
        if (!first_name || !last_name || !direccion || !date || !email || !password) {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.status(400).send({status: "error", error: "Incomplete values"}) 
        }
        
        const user = await userService.getBy({ email })
        if (user) {
            req.logger.error(`${req.infoPeticion} | El email ya existe en nuestra base de datos`)
            return res.status(400).send({status: "error", error: "El email ya existe en nuestra base de datos"})
        }
        
        const hashedPassword = await createHash(password) // Hashea la contraseña para que no sea visible para nadie

        //! Corregir
        const newCart = await cartService.save({ // Creo un nuevo carrito y luego asocio su id al nuevo usuario
            contenedor: []
        })

        const usuario = UserDto.getRegisterFrom({
            first_name,
            last_name,
            email,
            password: hashedPassword, // Guardamos en MongoDB el pasword hasheado
            direccion,
            date,
            phone: phone || "No especificado",
            image: `/images/profiles/${req.file ? req.file.filename : "default.webp"}`, // Sabemos que la foto de perfil se guarda en esta ruta relativa. En caso de registrar al usuario con Swagger, se guardará la que viene por defecto (default.webp)
            cartId: newCart._id.valueOf()
        })
    
        const result = await userService.save(usuario)
        return res.status(200).send({ status: "success", payload: result}) // Enviamos al usuario, dando por hecho que todo salió bien
    
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })
    }
}

const login = async (req: Request, res: Response) => { // En /api/sessions/login con el método POST, logueamos al usuario según el email y password que llegó en el body
    const { email, password } = req.body
    try {
        if (email === config.admin.email) { // Los administradores se pueden loguear con un mail y contraseña especial guardada como variable de entorno, por seguridad no se guardan en la misma base de datos que los usuarios
            if (password !== config.admin.password) {
                req.logger.error(`${req.infoPeticion} | Contraseña inválida`)
                return res.status(400).send({status: "error", error: "Contraseña inválida"})
            }
            const userDatosPublicos = UserDto.getLoginForm({ email })

            const tokenizedUser = jwt.sign(userDatosPublicos, config.jwt.secret, { expiresIn: "7d" })
            return res.cookie(config.jwt.nameCookie, tokenizedUser, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
            }).status(200).send({ status: "success", message: `Usuario con email ${userDatosPublicos.email} logueado!`})
        }

        const usuario = await userService.getBy({ email })
        
        if (!usuario) {
            req.logger.error(`${req.infoPeticion} | Email no registrado`)
            return res.status(400).send({status: "error", error: "Email no registrado"})
        }
        
        const isValidPassword = await validatePassword(usuario, password)
        if (!isValidPassword) {
            req.logger.error(`${req.infoPeticion} | Contraseña inválida`)
            return res.status(400).send({status: "error", error: "Contraseña inválida"})
        }
    
        const userDatosPublicos = UserDto.getLoginForm(usuario)
        const tokenizedUser = jwt.sign(userDatosPublicos, config.jwt.secret, { expiresIn: "7d" }) // Colocamos la tokenización | Cifra al usuario en un token que expira en 7 días
        return res.cookie(config.jwt.nameCookie, tokenizedUser, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).status(200).send({ status: "success", message: `Usuario con email ${userDatosPublicos.email} logueado!`}) // Guardo el token en una cookie con un nombre para identificarlo
    
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({status: "error", error })
    }
}

const current = async (req: Request, res: Response) => { // En /api/sessions/current con el método GET se obtiene la información del usuario logueado
    const user = req.user
    return res.status(200).send({ status: "success", payload: user })
}

const passwordRestoreRequest = async (req: Request, res: Response) => { // En /api/sessions/passwordRestoreRequest con el método POST se envía un mail pidiendo reestablecer contraseña
    const { email } = req.body
    
    if (!email) {
        req.logger.error(`${req.infoPeticion} | Invalid email`)
        return res.status(400).send({ status: "error", error: "Email inválido" })
    }

    const user = await userService.getBy({ email })
    if (!user) { // Verifico que el usuario con este email ya esté registrado
        req.logger.error(`${req.infoPeticion} | No user found with this email`)
        return res.status(400).send({ status: "error", error: "No existe ningún usuario con el email indicado" })
    }

    const recoverToken = jwt.sign({ email }, config.jwt.secret, { expiresIn: "1d" }) // Cifra en un token al email, establece un timepo de un día para que el usuario reestablezca la contraseña
    
    try {
        await sendMail({ // Se envía al mail un link donde se podrá cambiar la contraseña
            from: "Proyecto backend",
            to: email,
            subject: `Sitio de películas | Reestablecimiento de contraseña`,
            html:`
            <div>
                <h1>Solicitud de reestablecimiento de contraseña</h1>
                <p>Para reestablecer la contraseña, entra al siguiente <a href=${config.site.urlfrontend}/formUsers/restorePassword?token=${recoverToken}>enlace</a></p>
                <p>Si no solicitaste un cambio de contraseña, desestima este mensaje</p>
            </div>
            `
        })
        return res.status(200).send({ status: "success", message: `Solicitud para reestablecer mail enviada a ${email}` })
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({ status: "error", error })
    }
}

const restorePassword = async (req: Request, res: Response) => { // En /api/sessions/restorePassword con el método PUT, se reestablece la contraseña de un usuario
    const { password, token } = req.body // Del body tiene que llegar la nueva contraseña y el email tokenizado
    
    try {
        if (!password) {
            req.logger.error(`${req.infoPeticion} | Invalid password`)
            return res.status(400).send({ status: "error", error: "Contraseña inválida" })
        }

        const { email } = jwt.verify(token, config.jwt.secret) as { email: Email } // Descifro el email

        const user = await userService.getBy({ email })
        if (!user) {
            req.logger.error(`${req.infoPeticion} | No user found with this email`)
            return res.status(400).send({ status: "error", error: "No user found with this email" })
        }
    
        const newPassword = await createHash(password) // Cambiamos la contraseña del usuario, pero primero la hasheamos
        await userService.updateBy({ _id: user._id }, {$set: { password: newPassword }})
        
        return res.send({ status: "success", message: "Contraseña cambiada" })
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError && error.expiredAt) {
            req.logger.error(`${req.infoPeticion} | Token expirado, tiempo para reestablecer la contraseña agotado | ${error}`)
            return res.status(403).send({ status: "error", error: "Tiempo para reestablecer la contraseña agotado" })
        }

        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(500).send({ status: "error", error })
    }
}

const logout = async (req: Request, res: Response) => { // En /api/sessions/logout con el método GET se desloguea al usuario actual, si es que había uno logueado
    try {
        res.clearCookie(config.jwt.nameCookie, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        }).send({ status: "success", message: "Usuario deslogueado" }) // Deslogueo al usuario eliminando la cookie
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        res.status(500).send({ status: "error", error: "Error, inténtelo de nuevo más tarde" })
    }
}

export default {
    register,
    login,
    current,
    passwordRestoreRequest,
    restorePassword,
    logout,
}
