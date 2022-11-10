const ulProductos = document.getElementById("contenedor-productos")

const socket = io();

socket.on("enviarArray", data => { // Mapeo los productos cada vez que se envía algo en el formulario
    ulProductos.innerHTML = ""
    data.forEach(producto => {
        ulProductos.innerHTML += `
        <div>
            <p> Título: ${producto.title} </p>
            <p> Precio: $${producto.price} </p>         
            <p> Imagen: <img src=${producto.image} > </p>
        </div>
        `
    })
})
