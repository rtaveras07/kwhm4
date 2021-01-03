
//funcion que guardara el consumo anterior y fecha de ultima lectura que el usuario proporcione
function config(consumo) {

let kwmAnterior=consumo;
localStorage.setItem('kwmAnterior', JSON.stringify(kwmAnterior));
//let consumoAnterior = JSON.parse(localStorage.getItem('kwmAnterior'));
//console.log(consumoAnterior);
let d = new Date();
let fechaLectAnt =d.getDate()+"/"+d.getMonth()+"/"+ d.getFullYear();
localStorage.setItem('fechaLectAnt', JSON.stringify(fechaLectAnt));

}