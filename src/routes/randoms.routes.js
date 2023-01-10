import { Router } from "express";
import { fork } from "child_process"
import __dirname from "../utils.js";

const router = Router();

router.get("/", (req, res) => {
    const { cant } = req.query

    const objeto = {}
    for (let i=1; i<=1000; i++) { // Construyo un objeto cuyas claves van del 1 al 1000, y sus valores son todos 0
        objeto[i] = 0
    }

    const childProcess = fork(__dirname + "/utils/numerosAleatorios.js") // Le pido que haga un forkeo a este script
    childProcess.send({objeto, cant}) // Envío este objeto (los datos que necesito para luego ejecutar la función de allá)
    
    childProcess.on("message", objetoConstruido => {
        res.send({ status: "sucess", payload: objetoConstruido})
    })
})

export default router
