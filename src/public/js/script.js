const ulProductos = document.getElementById("contenedor-productos")

const socket = io();

socket.on("enviarProducts", data => { // Mapeo los productos cada vez que se envía algo en el formulario
    ulProductos.innerHTML = ""
    data.forEach(producto => {
        ulProductos.innerHTML += `
        <div>
            <p> Título: ${producto.title} </p>
            <p> Descripción: ${producto.description} </p>
            <p> Precio: $${producto.price} </p>         
            <p> Imagen: <img src=${producto.image} > </p>
        </div>
        `
    })
})
