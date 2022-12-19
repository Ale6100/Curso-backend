document.getElementById("cerrarSesion").addEventListener("click", async () => {
    
    const user = await fetch("/api/sessions/user").then(res => res.json()) // Obtengo el nombre del usuario que se quiere desloguear

    Swal.fire({
        title: `Hasta luego ${user.first_name} ${user.last_name}!`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
    }).then( async () => { // Después de dos segundos se desloguea y actualiza la página
        const res = await fetch("/api/sessions/logout").then(res => res.json())
        console.log(res)
        window.location = window.location
    });
})