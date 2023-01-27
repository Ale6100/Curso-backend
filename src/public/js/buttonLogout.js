document.getElementById("cerrarSesion").addEventListener("click", async () => {
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

    const result = await fetch("/api/sessions/logout").then(res => res.json())
    
    if (result.status === "success") {
        Toastify({
            text: "Deslogueado!",
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
            text: "Error! Intente de nuevo más tarde",
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