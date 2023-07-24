import copyfiles from "copyfiles";

copyfiles(['src/**/!(*.ts)', 'dist'], { up: 1 }, (err) => { // Se encarga de copiar todos los archivos de la carpeta src a dist, menos aquellos que tengan extensión ".ts"
    if (err) console.error(err);
});
