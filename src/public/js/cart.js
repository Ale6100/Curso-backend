const contenedorListaCart = document.getElementById("contenedorListaCart")
const precioTotal = document.getElementById("precioTotal")
const botonComprar = document.getElementById("comprar")

const renderizar = async () => {
    const user = await fetch("/api/sessions/user").then(res => res.json()) // Obtengo el usuario actual
    const cartId = user.cartId
    const carrito =  await fetch(`/api/cart/${cartId}/products`).then(res => res.json().then(res => res.payload)) // Su carrito asignado, que contiene el id de los productos dentro y la cantidad de cada uno
    const arrayProductos = [] // Aca obtengo un array con los productos del carrito

    for (let i=0; i<carrito.contenedor.length; i++) {
        const producto = await fetch(`/api/products/${carrito.contenedor[i].id}`).then(res => res.json()).then(res => res.payload)
        arrayProductos.push(producto)
    }

    let div = document.createElement("div")
    if (arrayProductos.length > 0) { // Mapeo la lista de productos
        
        arrayProductos.forEach((producto, i) => {
            div.innerHTML += `
            <div class="card-product">
                <ul>
                    <li> Título: ${producto.title} </li>
                    <li> Precio (c/u): $${producto.price} </li>    
                    <li> Imagen: <img src=${producto.image}> </li>
                    <li> Cantidad: ${carrito.contenedor[i].quantity} </li>
                </ul>
            </div>
            `
        })
        contenedorListaCart.append(div)
    } else {
        contenedorListaCart.innerHTML += `<p>No hay productos por mostrar</p>`
    }

    const preciosIndividuales = carrito.contenedor.map((producto, i) => producto.quantity*arrayProductos[i].price)
    const precioFinal = preciosIndividuales.reduce((previousValue, currentValue) => previousValue+currentValue, 0)
    precioTotal.innerText = `${precioFinal}`

    div.innerHTML += `<p>Precio total: $${precioFinal}</p>`

    const divPedido = document.createElement("div")
    divPedido.innerHTML = `<h1>Nuevo pedido de ${user.first_name} ${user.last_name} | ${user.email}</h1>` + `${div.outerHTML}` + `<p>Dirección de llegada: ${user.direccion}</p>`

    if (arrayProductos.length > 0) {
        botonComprar.addEventListener("click", async () => {
            const obj = {
                from: `${user.first_name} ${user.last_name}`,
                to: `${user.email}`,
                subject: "Confirmación de compra",
                html: `${divPedido.outerHTML}`,
                user
            }
            
            const res = await fetch("/cart/comprar", { // Envio al objeto que me permitirá enviar el mail de confirmación
                method: "PUT",
                body: JSON.stringify(obj),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json())
    
            if (res.status === "success") {
                contenedorListaCart.innerHTML = `<h2>Lista</h2> <p>No hay productos por mostrar</p>`
                Toastify({
                    text: "Compra exitosa!",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
        
                location.assign("/")
                
            } else {
                Toastify({
                    text: "Error, vuelve a intentar más tarde",
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
    }
}

renderizar()
