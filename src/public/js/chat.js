//! Aviso: por cómo está programado el guardado de mensajes en el historialChats.json, el chat no va a funcionar bien si desarrollamos con nodemon

const socket = io({ // Inicializamos socket del lado del cliente
    autoConnect: false
}); 

let user;

Swal.fire({ // Muestra una alerta que te pide tu nombre
    title: "Identifícate",
    input: "text",
    text: "Por favor ingresa tu nombre de usuario",
    inputValidator: (value) => { // Valida que en el imput no coloquemos un string numérico o vacío
        if (!isNaN(value)) { 
            return "¡Utiliza un nombre de usaurio válido!"
        }
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then(result => {
    user = result.value
    socket.connect() // Le pedimos que se conecte cuando el usuario ingresó un nombre válido
    socket.emit("autenticado", user)
})

const chatBox = document.getElementById("chatBox")

chatBox.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        const mensaje = chatBox.value.trim() // Quita los espacios sobrantes al principio y al final del mensaje
        if (mensaje.length > 0) { // Se ejecuta si el mensaje es un string no vacío
            socket.emit("message", {user, message: mensaje}) // Emito un evento personalizado "message". Envío el usuario y el mensaje
            chatBox.value = ""
        }
    }
})

const logsPanel = document.getElementById("logsPanel")

socket.on("logs", data => { // Muestro los mensajes pasados
    logsPanel.innerHTML = ""
    data.forEach(element => {
        logsPanel.innerHTML += `<p>${element.user} dice: ${element.message}</p>`
    })
})

socket.on("newUserConnected", data => { // Muestra una pequeña alerta cuando un usuario nuevo se conecta
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        title: `${data} se ha unido al chat`,
        icon: "success"
    })
})
