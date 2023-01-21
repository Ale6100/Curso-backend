const cardProduct = document.querySelectorAll(".card-product")

for (let i=0; i<cardProduct.length; i++) { // Logica del boton + y - de cada producto en el index
    const cardStock = document.getElementById(`cardStock-${i}`)
    const containerButtons = document.getElementById(`card-containerButtons-${i}`)
    const botonMas = containerButtons.children[0]
    const cantProd = containerButtons.children[1]
    const botonMenos = containerButtons.children[2]
    const botonAgregar = document.getElementById(`buttonAgregar-${i}`)
    const productId = botonAgregar.parentElement.id

    botonMas.addEventListener("click", () => {
        let cant = parseInt(cantProd.innerText)
        let stock = parseInt(cardStock.innerText)
        if (cant < stock) {
            cant += 1
            cantProd.innerText = cant
        }
        
    })

    botonMenos.addEventListener("click", () => {
        let cant = parseInt(cantProd.innerText)
        if (cant > 0) {
            cant -= 1
            cantProd.innerText = cant
        }
    })

    botonAgregar.addEventListener("click", async () => {
        let cant = parseInt(cantProd.innerText)

        const cartId = await fetch("/api/sessions/user").then(res => res.json()).then(res => res.cartId)

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

        for (let i=1; i <= cant; i++) { // Agrego "cant" cantidad de veces un producto al carrito, uno a la vez (tanto esta como muchas otras cosas serán optimizadas luego)
            console.log(productId);
            await fetch(`/api/cart/${cartId}/products/${productId}`, {
                method: "POST"
            })
        }

        Toastify({
            text: "Producto agregado al carrito!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();

        cantProd.innerText = "0"
        botonAgregar.setAttribute("disabled", true)
    })
}
