const register = (req, res) => {
    const { redirect } = req.query
    const usuario = req.user
    if (usuario) {
        res.render("logueadoReg")
    } else {
        res.render("formRegister", { redirect })
    }
}

const login = (req, res) => {
    const { redirect } = req.query
    const usuario = req.user
    if (usuario) {
        res.render("logueadoLog")
    } else {
        res.render("formLogin", { redirect })
    }
}

const passwordRestoreRequest = (req, res) => { // Vista donde se pide el mail para restaurar la contraseña
    res.render("passwordRestoreRequest")
}

const restorePassword = (req, res) => {
    res.render("restorePassword")
}

export default {
    register,
    login,
    passwordRestoreRequest,
    restorePassword
}
