const form = document.getElementById("restorePassword")
const params = new Proxy(new URLSearchParams(location.search), { // Obtiene de la URL las queries que encuentre
    get: (searchParams, prop) => searchParams.get(prop)
})

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const data = new FormData(form);
    const obj = {}
    data.forEach((value, key) => obj[key] = value)
    obj.token = params.token // Agrego el token pasado en la URL

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

    const res = await fetch("/api/sessions/restorePassword", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

    if (res.status === "success") {
        Toastify({
            text: "Contraseña cambiada con éxito!",
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
            text: res.error,
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