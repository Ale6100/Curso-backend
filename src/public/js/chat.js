"use strict";

// import { denormalize } from "normalizr"; // Quisiera importarla pero no me lo permite

const socket = io({ // Inicializamos socket del lado del cliente
    autoConnect: false
}); 

let id, nombre, apellido, edad, alias, avatar;

const alerta = (title, text, returnText) => {
    return Swal.fire({ // Muestra una alerta que te pide un dato
        title: title,
        input: "text",
        text: text,
        inputValidator: (value) => { // Valida que en el imput no coloquemos un string vacío
            if (!value) { 
                return returnText
            }
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
    })
}

const ejecutarAlertas = async () => { // Ejecuta todas las alertas que te piden los datos al ingresar
    const inputNombre = await alerta("1) Nombre", "Por favor ingresa tu nombre", "¡Escribe un nombre válido!")
    nombre = inputNombre.value
    const inputApellido = await alerta("2) Apellido", "Por favor ingresa tu apellido", "¡Utiliza un apellido válido!")
    apellido = inputApellido.value
    const inputEmail = await alerta("3) Email", "Por favor ingresa tu email", "¡Utiliza un email válido!")
    id = inputEmail.value
    const inputEdad = await alerta("4) Edad", "Por favor ingresa tu edad", "¡Utiliza una edad válida!")
    edad = inputEdad.value
    const inputAlias = await alerta("5) Alias", "Por favor ingresa tu alias", "¡Utiliza un alias válido!")
    alias = inputAlias.value
    const inputAvatar = await alerta("6) Avatar", "Por favor ingresa tu avatar (URL)", "¡Envía un avatar válido!")
    avatar = inputAvatar.value
    socket.connect() // Le pedimos que se conecte cuando el usuario ingresó todos los vampos válidos
    socket.emit("autenticado", alias)
}

ejecutarAlertas()

const chatBox = document.getElementById("chatBox")

chatBox.addEventListener("keyup", e => {
    if (e.key === "Enter") {
        const mensaje = chatBox.value.trim() // Quita los espacios sobrantes al principio y al final del mensaje
        if (mensaje.length > 0) { // Se ejecuta si el mensaje es un string no vacío
            const documentoChat = { // Nueva estructura de cada mensaje
                author: {
                    id,
                    nombre,
                    apellido,
                    edad,
                    alias, 
                    avatar
                },
                text: mensaje
            }
            socket.emit("message", documentoChat) // Versión nueva
            // socket.emit("message", {user: alias, message: mensaje, fecha, hora}) // Emito un evento personalizado "message". Envío el usuario, el mensaje, la fecha y la hora
            chatBox.value = ""
        }
    }
})

const logsPanel = document.getElementById("logsPanel")

socket.on("enviarMensajes", data => { // Muestro los mensajes pasados
    // const revertedData = denormalize(data[0].result, data[1], data[0].entities) // Acá desnormalizaría si tan solo me dejara importar esta función
    // data = revertedData.mensajes

    //*/*//*//*//*//*//*//*//*//*//*//*//*//*//*//*/*//

    // logsPanel.value = ""
    // data.forEach((element, index) => {
    //     if (index === 0) { // En primer mensaje se muestra esto
    //         logsPanel.value += `----- ${element.fecha} -----\n\n${element.user} dice:\n${element.hora} - ${element.message}`
        
    //     } else {
    //         if (data[index].fecha !== data[index-1].fecha) { // Si un mensaje se envió un día distinto al anterior, entonces muestra la fecha de este nuevo mensaje
    //             logsPanel.value += `\n\n----- ${element.fecha} -----`
    //         }

    //         if (data[index].user === data[index-1].user) { // En caso de que un usuario escriba dos mensajes seguidos
    //             logsPanel.value += `\n${element.hora} - ${element.message}`
    //         } else {
    //             logsPanel.value += `\n\n${element.user} dice:\n${element.hora} - ${element.message}`
    //         }
    //     }
    //     logsPanel.scrollTop = logsPanel.scrollHeight // Hago que la barra siempre vaya abajo de todo cuando enviamos un mensaje
    // })
})

socket.on("newUserConnected", alias => { // Muestra una pequeña alerta cuando un usuario nuevo se conecta
    Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        title: `${alias} se ha unido al chat`,
        icon: "success"
    })
})
