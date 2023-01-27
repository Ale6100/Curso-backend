const checkLogger = (req, res, next) => {
    const rutasIgnoradas = ["/formUsers/register", "/formUsers/login"] // Rutas que serán ignoradas por el middleware
    const noSeIgnora = !rutasIgnoradas.includes(req.path) // Uso req.path porque no quiero que incluya las querys
    
    if (req.method === "GET" && noSeIgnora) { // Analizo únicamente con el método get
        const usuario = req.session.user
        if (!usuario) {
            res.redirect("/formUsers/login?redirect=true")

        } else {
            next()
        }
    } else {
        next()
    }
}

export default checkLogger
