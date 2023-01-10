// Nos permite configurar todas las posibles instancias de pm2 que necesitemos para el servidor
module.exports = {
    apps: [
        {
            name: "ServForkeado_8089", // Nombre del aplicativo
            script: "src/app.js", // Ruta al script base que se ejecutará al leer este objeto
            env: { // Se pueden configurar variables de entorno desde acá
                PORT: 8089
            },
            // watch: true // Activa el modo watch (análogo a nodemon)
            args: "--mode pm2", // Argumentos personalizados que se colocarán en la terminal al ejecutar la ruta de la propiedad "script"
            node_args: "--harmony --expose-gc" // Se agregan estos argumentos preconfigurados en la terminal cuando se inicia el aplicativo. exposegc trata de hacer que los argumentos de args no se pierdan debido al garbage collector. El harmony es para que funcione con funcionalidades de es6
        },
        {
            name: "ServClusterizado_8088",
            script: "src/app.js",
            env: {
                PORT: 8088
            },
            // watch: true,
            args: "--mode pm2", 
            node_args: "--harmony --expose-gc",
            exec_node: "cluster", // Le pido a pm2 que ejecute en modo cluster
            instances: "max", // Pedimos que ejecute todas las instancias posibles para la computadora actual            
        },
        {
            name: "ServForkeado_8080",
            script: "src/app.js",
            env: {
                PORT: 8080
            },
            // watch: true
            args: "--mode nginxCincoPuertos",
            node_args: "--harmony --expose-gc"
        },
        {
            name: "ServClusterizado_8082",
            script: "src/app.js",
            env: {
                PORT: 8082
            },
            // watch: true,
            args: "--mode nginxCincoPuertos", 
            node_args: "--harmony --expose-gc",
            exec_node: "cluster",
            instances: 1,           
        },
        {
            name: "ServClusterizado_8083",
            script: "src/app.js",
            env: {
                PORT: 8083
            },
            // watch: true,
            args: "--mode nginxCincoPuertos", 
            node_args: "--harmony --expose-gc",
            exec_node: "cluster",
            instances: 1,           
        },
        {
            name: "ServClusterizado_8084",
            script: "src/app.js",
            env: {
                PORT: 8084
            },
            // watch: true,
            args: "--mode nginxCincoPuertos", 
            node_args: "--harmony --expose-gc",
            exec_node: "cluster",
            instances: 1,           
        },
        {
            name: "ServClusterizado_8085",
            script: "src/app.js",
            env: {
                PORT: 8085
            },
            // watch: true,
            args: "--mode nginxCincoPuertos", 
            node_args: "--harmony --expose-gc",
            exec_node: "cluster",
            instances: 1,           
        },
    ]
}
