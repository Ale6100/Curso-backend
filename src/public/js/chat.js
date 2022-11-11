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
            const fecha = new Date().toLocaleDateString() // Fecha y hora en la que se mandó el mensaje
            const hora = new Date().toLocaleTimeString()
            socket.emit("message", {user, message: mensaje, fecha, hora}) // Emito un evento personalizado "message". Envío el usuario, el mensaje, la fecha y la hora
            chatBox.value = ""
        }
    }
})

const logsPanel = document.getElementById("logsPanel")

socket.on("logs", data => { // Muestro los mensajes pasados
    logsPanel.value = ""
    data.forEach((element, index) => {
        if (index === 0) { // En primer mensaje se muestra esto
            logsPanel.value += `----- ${element.fecha} -----\n\n${element.user} dice:\n${element.hora} - ${element.message}`
        
        } else {
            if (data[index].fecha !== data[index-1].fecha) { // Si un mensaje se envió un día distinto al anterior, entonces muestra la fecha de este nuevo mensaje
                logsPanel.value += `\n\n----- ${element.fecha} -----`
            }

            if (data[index].user === data[index-1].user) { // En caso de que un usuario escriba dos mensajes seguidos
                logsPanel.value += `\n${element.hora} - ${element.message}`
            } else {
                logsPanel.value += `\n\n${element.user} dice:\n${element.hora} - ${element.message}`
            }
        }
        logsPanel.scrollTop = logsPanel.scrollHeight // Hago que la barra siempre vaya abajo de todo cuando enviamos un mensaje
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
