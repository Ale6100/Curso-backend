const form = document.getElementById("formRestorePassoword")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const data = new FormData(form);
    const obj = {}
    data.forEach((value, key) => obj[key] = value)

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

    const res = await fetch("/api/sessions/passwordRestoreRequest", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())

    
    if (res.status === "success") {
        Toastify({
            text: "Mail enviado! Verifica tu bandeja de entrada",
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