import chai from "chai";
import supertest from "supertest";

const expect = chai.expect // Lo vamos a usar para "estar a la espectativa de algo"
const requester = supertest("http://localhost:8080") // Levanta supertest apuntando a un servidor en particular, que ya debe estar levantado

const mailDeTesteo = Math.floor(Math.random()*100000) + "example@gmail.com" // Me aseguro de testear siempre con un mail distinto
console.log(`Testeo con mail: ${mailDeTesteo}`);

describe('Testeo del servidor', () => { // Separamos los testeos en secciones, para tenerlo ordenado
    describe("Test de productos", () => {
        it('El endpoint a la ruta /api/products con el método POST debe crear un nuevo producto en la base de datos', async () => { // Esta será una prueba
            const productMock = {
                title: "Titulo test",
                description: "description test",
                price: 10,
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqYIP6aOhx3R4SJpE4Og75jOn_huCyNzESFvO7Zi29TQ&s",
                stock: 5
            }

            const response = await requester.post("/api/products").send(productMock) // Envía un post a la ruta solicitada
            expect(response.status).to.be.equal(200) // Espero que el status sea igual a 200
            expect(response._body).to.have.property("idProduct") // Espera que la respuesta del enpoint tenga la propiedad "payload"
        });
    })

    describe('Test de registro', () => { // Este test es distinto pues además de un objeto simple se se necesita enviar un archivo imagen
        it("El enpoint a la ruta api/sessions/register con el método POST debe crear un nuevo usuario en la base de datos", async () => {
            const userMock = {
                first_name: "Juanito",
                last_name: "Alcachofa",
                email: mailDeTesteo,
                password: "123",
                direccion: "unadireccion",
                age: "98",
                phone: "1111111112"
            }

            const response = await requester.post("/api/sessions/register")
            .field("first_name", userMock.first_name) // Definimos los campos uno por uno
            .field("last_name", userMock.last_name)
            .field("email", userMock.email)
            .field("password",  userMock.password)
            .field("direccion", userMock.direccion)
            .field("age", userMock.age) 
            .field("phone", userMock.phone)
            .attach("image", "./test/default.webp") // Hacemos el test con este archivo que se encuentra en esta ruta, simulando que se pasó con un input file con multer

            expect(response.status).to.be.eql(200)
            expect(response._body.payload).to.have.property("_id") // Verifico que la propiedad payload del response tenga a su vez la propiedad _id, para verificar que sí se guardó en mongo
            expect(response._body.payload.image).to.be.ok // Verifica que exista esta propiedad
        }) 
    });

    describe("Test de login", () => {
        it('El enpoint a la ruta api/sessions/login con el método POST debe loguear correctamente a un usuario y debe insertar una cookie con el token', async () => {
            const userMock = {
                email: mailDeTesteo,
                password: "123"
            }

            const response = await requester.post("/api/sessions/login").send(userMock);
            const cookieHeader = response.headers["set-cookie"][0] // Accedo a la cookie, habiendo consologueado previamente response.headers
            expect(cookieHeader).to.be.ok // Verifico que existe la cookie actual, sabiendo que actualmente se coloca en un array de un elemento
            expect(response.status).to.be.eql(200)

            const cookieRecortada = cookieHeader.split(";")
            const cookie = { // Declaramos la cookie en el contexto de sesión
                name: cookieRecortada[0].split("=")[0], // Accedemos al nombre y valor de la cookie
                value: cookieRecortada[0].split("=")[1]
            }

            expect(cookie.name).to.be.ok.and.eql("personalCookie")
        });  
    })

    describe("Test cálculo pesado", () => {
        it('El enpoint a la ruta /api/randoms con el método GET debe traer un objeto cuya propiedad payload es un objeto construido con resultados matemáticos', async () => {
            const response = await requester.get("/api/randoms?cant=20000");
            expect(response.status).to.be.eql(200) // Verifico que no hubo error
            expect(response._body).to.have.property("payload") // Verifico que la propiedad "payload" existe, ya que sé que sólo existe si el res.send() se ejecutó correctamente
            expect(response._body.payload).to.have.property("1") // Testeo que la propiedad del objeto en payload tiene propiedad 1 (debe tener desde 1 hasta 1000 realmente)
        });  
    })
});
