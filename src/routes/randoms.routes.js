import { Router } from "express";
import { fork } from "child_process"
import __dirname from "../utils.js";

const router = Router();

const arrayAObjeto = (array) => { // Recibe un array cuyos elementos son arrays dobles con claves y valores, y retorna un objeto cuyas propiedades son las claves y sus valores son los valores correspondientes de los arrays dobles del array de entrada
    const objeto = {}
    array.forEach(([key, value]) => objeto[key] = value) // Construyo el objeto usando la sintaxis de destructuring
    return objeto
}

const array = [] // Construyo un array que cumpla con las condiciones que pide la función arrayAObjeto
for (let i=1; i<=1000; i++) {
    array.push([i, 0])
}

const objeto = arrayAObjeto(array)

router.get("/", (req, res) => {
    const { cant } = req.query

    const childProcess = fork(__dirname + "/utils/numerosAleatorios.js") // Le pido que haga un forkeo a este script
    childProcess.send({objeto, cant}) // Envío este objeto (los datos que necesito para luego ejecutar la función de allá)
    
    childProcess.on("message", objetoConstruido => {
        res.send({ status: "sucess", payload: objetoConstruido})
    })
})

export default router
