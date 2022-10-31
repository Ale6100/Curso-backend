const actualizar = document.getElementById("actualizar")

document.getElementById("inputCheckAct").addEventListener("click", () => { // Habilita o deshabilita el input que pide un id para actualizar un producto. Si está habilitado es porque no queremos agregar un nuevo id, sino actualizarlo
    actualizar.disabled = actualizar.disabled ? false : true
})

const eliminar = document.getElementById("eliminar")
const inputCampos = document.querySelectorAll(".inputCambiante")

document.getElementById("inputCheckElim").addEventListener("click", () => { //Habilita o deshabilita los inputs con clase "inputCambiante". Si están deshabilitados es porque queremos eliminar un producto
    if (eliminar.disabled) {
        eliminar.disabled = false
        inputCampos.forEach(input => {
            input.disabled = true
        })
    } else {
        eliminar.disabled = true
        inputCampos.forEach(input => {
            input.disabled = false
        })
    }
})

const form = document.getElementById("productosForm")

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    if (actualizar.disabled && eliminar.disabled) { // El if se ejecuta si queremos agregar un producto por primera vez
        fetch("/api/productos", { // Enviamos a esta ruta el formData
            method: "POST",
            body: formData // Enviamos los datos al body. Multer se va a encargar de procesarlos
        }).then(res => res.json()).then(res => console.log("Método POST ejecutado\n", res))
    
    } else if (actualizar.disabled == false && eliminar.disabled) { // Se ejecuta si queremos modificar un objeto mediante su id
        fetch(`/api/productos/${actualizar.value}`, {
            method: "PUT",
            body: formData
        }).then(res => res.json()).then(res => console.log("Método PUT ejecutado\n", res))
        
    } else { // Se ejecuta si queremos borrar un producto según su id
        fetch(`/api/productos/${eliminar.value}`, {
            method: "DELETE" // No me pareció necesario enviar una propiedad body
        }).then(res => res.json()).then(res => console.log("Método DELETE ejecutado\n", res))
    }
})
