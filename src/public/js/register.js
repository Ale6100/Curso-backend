const form = document.getElementById("formRegistroUsuario")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(form);
    const obj = {}
    formData.forEach((value, key) => obj[key] = value)

    Toastify({
        text: "Espere por favor...",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, rgb(100, 100, 100), rgb(200, 200, 200))",
        }
    }).showToast();

    const res = await fetch("/api/sessions/register", {
        method: "POST",
        body: formData, // Enviamos los datos al body. Multer se va a encargar de procesarlos
    }).then(res => res.json())
    
    if (res.status === "success") {
        Toastify({
            text: "Usuario registrado! Redireccionando...",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();

        location.assign("/formUsers/login")
        
    } else {
        Toastify({
            text: "Datos inválidos",
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
