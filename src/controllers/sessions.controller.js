import UserDto from "../dao/DTO/User.dto.js";

const register = async (req, res) => {
    const user = req.user; // Es lo que enviamos desde el done de passport.config
    res.status(200).send({ status: "success", payload: user})
}

const failedRegister = (req, res) => { // Página que muestra un mensaje si salió un error imprevisto en el registro con passport
    res.status(500).send({ status: "error", error: "Error de passport a la hora de registrarte" })
}

const login = async (req, res) => {
    req.session.user = UserDto.getLoginForm(req.user)
    res.status(200).send({ status: "success", message: `Usuario con email ${req.user.email} logueado!` })
}

const failedLogin = (req, res) => { // Página que muestra un mensaje si salió un error imprevisto en el logueo con passport
    res.status(500).send({ status: "error", error: "Error de passport a la hora de loguearse" })
}

const logout = async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            req.logger.fatal(`${req.infoPeticion} | No se pudo cerrar sesión | ${error}`)
            return res.status(500).send({ status: "error", message: "No se pudo cerrar sesión" })
        }
    })
    return res.send({ status: "success", message: "Deslogueado" })
}

const user = async (req, res) => {
    return res.send(req.session.user)
}

export default {
    register,
    failedRegister,
    login,
    failedLogin,
    logout,
    user
}
