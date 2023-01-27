const register = (req, res) => {
    const { redirect } = req.query
    const usuario = req.session.user
    if (usuario) {
        res.render("logueadoReg")
    } else {
        res.render("formRegister", { redirect })
    }
}

const login = (req, res) => {
    const { redirect } = req.query
    const usuario = req.session.user
    if (usuario) {
        res.render("logueadoLog")
    } else {
        res.render("formLogin", { redirect })
    }
}

export default {
    register,
    login
}
