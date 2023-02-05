import UserDto from "../dao/DTO/User.dto.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { userService, cartService } from "../services/repositories/services.js"
import sendMail from "../services/mailingService.js";
import { server } from "../app.js";
import { createHash, validatePassword } from "../utils.js";

const register = async (req, res) => {
    try {
        const { first_name, last_name, direccion, age, phone, email, password } = req.body;
        if (!first_name || !last_name || !direccion || !age || !phone || !email || !password) {
            req.logger.error(`${req.infoPeticion} | Incomplete values`)
            return res.send({status: "error", error: "Incomplete values"}) // Le decimos que hubo un error independiente a passport (ya que faltan datos, pero no es culpa del passport), por lo tanto no mandamos ningún usuario y enviamos un objeto con un oportuno mensaje de error
        }
        
        const user = await userService.getBy({ email })
        if (user) {
            req.logger.error(`${req.infoPeticion} | El email ya existe en nuestra base de datos`)
            return res.send({status: "error", error: "El email ya existe en nuestra base de datos"})
        }
        
        const hashedPassword = await createHash(password)

        const newCart = await cartService.save({ // Creo un nuevo carrito y luego asocio su id al nuevo usuario
            timestamp: Date.now(),
            contenedor: []
        })

        const usuario = UserDto.getDbDTOFrom({
            first_name,
            last_name,
            email,
            password: hashedPassword, // Guardamos en MongoDB el pasword hasheado
            direccion,
            age,
            phone,
            image: `${req.protocol}://${req.hostname}:${server.address().port}/images/${req.file ? req.file.filename : "default.webp"}`, // Sabemos que la foto de perfil se guarda en esta ruta
            cartId: newCart._id.valueOf()
        })
    
        const result = await userService.save(usuario)
        res.status(200).send({ status: "success", payload: result}) // Enviamos al usuario, dando por hecho que todo salió bien
    
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        res.status(500).send({status: "error", error })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {            
        const usuario = await userService.getBy({ email })
        
        if (usuario === null) {
            req.logger.error(`${req.infoPeticion} | Email no encontrado`)
            return res.send({status: "error", error: "Email no encontrado"})
        }
        
        const isValidPassword = await validatePassword(usuario, password)
        if (!isValidPassword) {
            req.logger.error(`${req.infoPeticion} | Contraseña inválida`)
            return res.send({status: "error", error: "Contraseña inválida"})
        }
    
        const userDatosPublicos = UserDto.getLoginForm(usuario)
        const tokenizedUser = jwt.sign(userDatosPublicos, config.jwt.secret, { expiresIn: "5m" }) // Colocamos la tokenización | Cifra al usuario en un token
        res.cookie(config.jwt.nameCookie, tokenizedUser).status(200).send({ status: "success", message: `Usuario con email ${userDatosPublicos.email} logueado!`}) // Guardo el token en una cookie con un nombre para identificarlo
    
    } catch (error) {
        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        res.status(500).send({status: "error", error })
    }
}

const current = async (req, res) => { // Se usa para obtener la información del usuario logueado
    const user = req.user
    if (!user) return res.send({status: "error", error: "Usuario no logueado"})
    res.send({ status: "success", payload: user })
}

const passwordRestoreRequest = async (req, res) => { // Se ejecuta cuando enviamos un mail pidiendo reestablecer contraseña
    const { email } = req.body
    
    if (!email) {
        req.logger.error(`${req.infoPeticion} | Empty mail, cannot send mail`)
        return res.status(400).send({ status: "error", error: "Por favor indique el email" })
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
            to: `${email}`,
            subject: `Reestablecimiento de contraseña`,
            html:`
            <div>
                <h1>Solicitud de reestablecimiento de contraseña</h1>
                <p>Para reestablecer la contraseña, entra al siguiente <a href=${config.site.urlfrontend}/formUsers/restorePassword?token=${recoverToken}>enlace</a></p>
                <p>Si no solicitaste un cambio de contraseña, desestima este mensaje</p>
            </div>
            `
        })
        res.send({ status: "success" })
    } catch (error) {
        req.logger.error(`${req.infoPeticion} | ${error}`)
        return res.status(400).send({ status: "error", error })
    }
}

const restorePassword = async (req, res) => {
    const { password, token } = req.body
    
    try {
        if (!password) {
            req.logger.error(`${req.infoPeticion} | Invalid password`)
            return res.status(400).send({ status: "error", error: "Contraseña inválida" })
        }

        const { email } = jwt.verify(token, config.jwt.secret) // Descifro el email
    
        const user = await userService.getBy({ email })
        if (!user) {
            req.logger.error(`${req.infoPeticion} | No user found with this email`)
            return res.status(400).send({ status: "error", error: "No user found with this email" })
        }
    
        const newPassword = await createHash(password) // Cambiamos la contraseña del usuario, pero primero la hasheamos
        await userService.updateBy({ _id: user._id }, {$set: { password: newPassword }})
        
        res.send({ status: "success", message: "Contraseña cambiada" })

    } catch (error) {
        if (error.expiredAt) {
            req.logger.error(`${req.infoPeticion} | Token expirado | ${error}`)
            return res.status(400).send({ status: "error", error })
        }

        req.logger.fatal(`${req.infoPeticion} | ${error}`)
        return res.status(400).send({ status: "error", error })
    }
}

const failedLogin = (req, res) => { // Página que muestra un mensaje si salió un error imprevisto en el logueo con passport
    res.status(500).send({ status: "error", error: "Error de passport a la hora de loguearse" })
}

const logout = async (req, res) => {
    try {
        res.clearCookie(config.jwt.nameCookie).send({ status: "success", message: "Deslogueado" }) // Al eliminar la cookie, deslogueo al usuario
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
    failedLogin,
    logout,
}
