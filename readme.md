# Proyecto e-commerce completo | Parte backend

**ACTUALIZACIÓN SEMANA 07/06/23: Proyecto en mantenimiento, puedes pasarte por los commits previos para tener una versión estable**

Este proyecto lo realicé en mi curso de Backend donde debía hacer un e-commerce. La parte Frontend (necesaria para que funcione) se encuentra [aquí](https://github.com/Ale6100/Curso-backend-parte-front.git).

## Comenzando 🚀

Lee atentamente las siguientes instrucciones si deseas obtener una copia funcional del proyecto en tu computadora.

Primero debes descargar el archivo comprimido _zip_ desde el botón "code" o hacer click [aquí](https://github.com/Ale6100/Curso-backend/archive/refs/heads/main.zip).

Si en cambio deseas tener una copia en tu propio repositorio de GitHub puedes _Forkear_ el proyecto. 

Mira **Despliegue** para conocer cómo desplegar el proyecto.

### Pre-requisitos 📋

Necesitas tener previamente descargado e instalado [NodeJs](https://nodejs.org/).

### Instalación 🔧

Instala las dependencias con el comando

```
npm install
```

## Despliegue 📦

Corre el proyecto con el comando

```
npm start
```

Es necesario crear variables de entorno mediante la elaboración de un archivo .env en el mismo nivel que la carpeta src. Este archivo debe completarse con los siguientes campos, los cuales deben modificarse con tus propias credenciales en lugar del valor "X". Es importante destacar que algunas credenciales, identificadas con un asterisco, pueden ser completadas con cualquier valor personalizado (por ejemplo: JWT_NAME_COOKIE = ilua21da812).:

```env
MONGO_URL = X # URL de mongo, la que ponemos dentro de mongoose.connect(X)

NODEMAILER_USER = X # Tu gmail, que será utilizado para enviar mails en el servicio de mensajería gratuito

NODEMAILER_PASS = X # Tu contraseña de gmail

JWT_NAME_COOKIE = X* # Nombre de la cookie donde se comprueba el logueo de un usuario

JWT_SECRET = X* # Cadena de caracteres que se utiliza como una clave secreta para firmar el token JSON Web Token

URL_FRONTEND = X # URL de tu frontend sin barra lateral final

ACCESS_TOKEN = X* # Cadena de caracteres utilizado como mecanismo de autenticación para asegurar que solamente los usuarios que presenten este token en los encabezados de sus solicitudes puedan acceder al backend. Importante: Su valor tiene que ser el mismo que el de la variable de entorno VITE_ACCESS_TOKEN que ponés en el [front](https://github.com/Ale6100/Curso-backend-parte-front.git).

ADMIN_EMAIL = X # Email del administrador

ADMIN_PASSWORD = X # Contraseña del administrador

STRIPE_SECRET_KEY = X # Key secreta de stripe
```

*Importante*: Asegúrate de que la [parte front](https://github.com/Ale6100/Curso-backend-parte-front.git) esté ejecutándose

## Construido con 🛠️

* CSS
* JavaScript
* [NodeJs](https://nodejs.org/)
* [mongoose](https://www.npmjs.com/package/mongoose)
* [connect-mongo](https://www.npmjs.com/package/connect-mongo)
* [express](https://www.npmjs.com/package/express)
* [Bycrypt](https://www.npmjs.com/package/bcrypt)
* [cookie-parser](https://www.npmjs.com/package/cookie-parser)
* [cors](https://www.npmjs.com/package/cors)
* [dotenv](https://www.npmjs.com/package/dotenv)
* [ejs](https://www.npmjs.com/package/ejs)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [minimist](https://www.npmjs.com/package/minimist)
* [multer](https://www.npmjs.com/package/multer)
* [nodemailer](https://www.npmjs.com/package/nodemailer)
* [stripe](https://www.npmjs.com/package/stripe)
* [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc)
* [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
* [winston](https://www.npmjs.com/package/winston)

## Autores ✒️

* **Alejandro Portaluppi** - [LinkedIn](https://www.linkedin.com/in/alejandro-portaluppi/)

## Expresiones de Gratitud 🎁

* [Mauricio Espinosa Flores](https://www.linkedin.com/in/mauricio-espinosa-flores-9b4202b4/) - Profesor Backend
* [Fernando Galdós Silva](https://www.linkedin.com/in/fernandogaldos/) - Tutor Backend
