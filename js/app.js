document.getElementById('add-item').addEventListener('click', realizarCalculos);
document.getElementById('configurarD').addEventListener('click', config);
//document.getElementById('add-staticBackdrop').addEventListener('loadstart', config);
const facturacion = document.getElementById('descripcionConsumo');
var isclean = document.getElementById('clean');
//boton del dialog
const configButton = document.getElementById('configButton');

var diasFacturacion = 30;// los dias establecidos para la fkacturacion por la empresa 30 dias 
var consumo = 0;
var precioRango1 = 4.44; // hasta 200 kw
var precioRango2 = 6.97;// de 201 a 300
var precioRango3 = 10.86; // de 301 a 700 
var precioRango4 = 11.10;// de 700 en adelante. 

var cargofijo2 = 137.25 // si su sonsumo es mayor o igual a 100 kw al mes. 
var cargofijo1 = 37.95  // si su consumo es inferior a 100 kw 

var consumofinal1 = 0; //variables para guardar el valor en consumo kwh segun el rango de consumo. 
var consumofinal2 = 0;
var consumofinal3 = 0;
var consumofinal4 = 0;
var kw;// almacena el consumo introducido por el usuario. 




 //limpiar entrada de usuario tras clic en unno de los tipos de consumos. 
const radio1=document.getElementById('diario').addEventListener('click', () => limpiaEntrada());
const radio2=document.getElementById('mensual').addEventListener('click', () => limpiaEntrada());
const radio3=document.getElementById('diferencia').addEventListener('click', () => limpiaEntrada());



function config() {

  let KW = localStorage.getItem('kwh');
  let FECHA = localStorage.getItem('fecha');

  var objeto_kw = document.getElementById('kwh');
  var objeto_fecha = document.getElementById('fecha');
  objeto_kw.value = KW;
  objeto_fecha.value = FECHA;


}


//Evento click para el boton del dialog
configButton.addEventListener('click', () => configConfirm());

function configConfirm() {

  let fanterior = document.getElementById('fecha').value; //valor entrada     
  let consAnterior = document.getElementById('kwh').value; //valor entrada  
  localStorage.setItem('kwh', consAnterior);
  localStorage.setItem('fecha', fanterior);

}


//**************************CALCULO DE CONSMO  */
function realizarCalculos() {

  consumofinal1 = 0;
  consumofinal2 = 0;
  consumofinal3 = 0;
  consumofinal4 = 0;
  

  let diario = document.getElementById("diario");
  let mensual = document.getElementById("mensual");
  let diferecia = document.getElementById("diferencia");
  kw = document.getElementById('entrada').value; //valor entrada 
 
 
  //validando seleccion radio button
  //consumo diario 
  if (diario.checked == true) {
   
    diasFacturacion = 30;  //ejemplo  10 kwh diarios x 30 dias del mes 
    consumo = kw * diasFacturacion;
    
  }
  //mensual check radio . ej. 260 kwh en el mes 
  if (mensual.checked == true) {
   
    diasFacturacion = 1;
    consumo = kw * diasFacturacion;
  }
  
  
  if (diferencia.checked == true) { 
     let consumoGuardado= localStorage.getItem('kwh');
     if(kw<consumoGuardado) {
alert("El consumo actual debe ser mayor al anterior para este tipo de cálculo");
consumo=0;
 
     } else {         
      
      var consumoAnterior = localStorage.getItem('kwh');
      var fechaAnterior = localStorage.getItem('fecha');
      let d = new Date();
      //fecha actual del sistema
      let fechaActual =d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() ;  
          
      //diferencia de las fechas en dias 
      fecha1 = new Date(fechaActual);
      fecha2 = new Date(fechaAnterior);     
    let diasTrnascurridos =    fecha1.getTime() -   fecha2.getTime(); 
    diasTrnascurridos= (diasTrnascurridos/(1000*60*60*24) ); 
     //diferencia de consumo entre los dias transcurridos
      consumo = kw - consumoAnterior; // para obtener la dierecncia por ej. 5490-5400=90     
      consumo=consumo/diasTrnascurridos;// 90 dividido por los dias transcurridos entre las fechas
      console.log('consumo = kw - consumoAnterior '+consumo);
      //ejemplo 10 dias de diferencias. = 9 
      consumo=consumo*30;// finalmente 9*30 seria el consumo a prediccion  

    
    }
    
  } 

  calculoRango(consumo);
  resultado();
}
function calculoRango(consumoCalc) {
  //logica de rango de consumo. 
  try {
    //Rango 1  , de 0 a 200 
    if (consumoCalc >= 200) {
      consumofinal1 = 200;
    } else {
      consumofinal1 = consumoCalc;
    }
    //Rango 2  de 201 a 300 
    if (consumo - 200 >= 100) {
      consumofinal2 = 100;
    }
    if (consumo - 200 <= 100 && consumo - 200 > 0) {
      consumofinal2 = consumo - 200;
    }
    //Rango 3 de 301 a 700
    if ((consumo - 300) < 700 && (consumo - 300) > 0) {
      let resultadoRango = (consumo - 300) * precioRango3;
      consumofinal3 = consumo - 300;
    }
    if ((consumo - 300) > 700) {
      consumofinal3 = 700;
    }

    //rango 4 
    if (consumo - 1000 > 0) {

      consumofinal4 = consumo - 1000;
    }
  } catch (error) {
    alert(error);
  }
}
//Calculando el cargo fijo 
function resultado() {
  try {
    if (consumo >= 100) {
      cargofijo = cargofijo2
    }
    else {
      cargofijo = cargofijo1
    }
    //calculando el consumo consu respectivo rango de consumo. 
    let rango1 = Math.round((consumofinal1 * precioRango1), 2);
    let rango2 = Math.round((consumofinal2 * precioRango2), 2);
    let rango3 = Math.round((consumofinal3 * precioRango3), 2);
    let rango4 = Math.round((consumofinal4 * precioRango4), 2);
    let total = Math.round( rango1 + rango2 + rango3 + rango4 + cargofijo, 2);
    //moneda 
    const formatterDolar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
    //desplegando el resultado 
    facturacion.innerHTML = '';
    facturacion.innerHTML += `<div>
      Consumo 30 días: ${Math.round(consumo, 2)} <br>
      Cargo fijo: ${cargofijo} <br>      
      ${consumofinal1} x ${precioRango1} = ${rango1} <br>
      ${Math.round(consumofinal2,2)} x ${precioRango2} = ${rango2} <br>
      ${consumofinal3} x ${precioRango3} = ${rango3} <br>
      ${consumofinal4} x ${precioRango4} =${rango4}<br>  
      <b>Promedio kh diario ${formatterDolar.format((consumo)/30)}</b>  
      <hr>
      <b>Total a Pagar : ${formatterDolar.format(total)}</b>   
     
      </div>`;
  } catch (error) {
    alert("error en resultados: " + error);
  }




}
function limpiaEntrada(){
  let entrada = document.getElementById('entrada'); //valor entrada 
  entrada.value="";
  facturacion.innerHTML = '-';

}