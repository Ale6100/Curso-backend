const form = document.getElementById("formRegistroUsuario")

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const data = new FormData(form);
    const obj = {}
    data.forEach((value, key) => obj[key] = value)

    const res = await fetch("/api/sessions/register", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.json())
    
    console.log(res)
})