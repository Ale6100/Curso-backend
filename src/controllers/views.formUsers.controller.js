const register = (req, res) => {
    res.render("formRegister")
}

const login = (req, res) => {
    const usuario = req.session.user
    if (usuario === undefined) {
        res.render("formLogin")
    } else {
        res.render("logueado")
    }
}

export default {
    register,
    login
}