const form = document.getElementById("formLoginUsuario")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const data = new FormData(form);
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    
    const res = await fetch("../api/sessions/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

    console.log(res)

    if (res.status === "success") {
        if (location.pathname === "/formUsers/login") {
            Toastify({
                text: "Logueado!",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        } else {
            Toastify({
                text: "Logueado! Redireccionando en 3 segundos...",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
            setTimeout(() => {
                window.location = window.location
            }, 3000);
        }
        
    } else {
        Toastify({
            text: "Email o contraseña incorrectos",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, rgb(255, 0, 0), rgb(0, 0, 0))",
            }
        }).showToast();
    }
})