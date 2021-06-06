async function obtenerCambios(base = 'eur', fecha = 'latest') {
    const BASE_URL = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/${fecha}/currencies/${base}.json`;
    console.log(BASE_URL);
    const resp = await fetch(BASE_URL);
  const resp_1 = await resp.json();
  return resp_1[`${base}`];
}
async function obtenerMonedas() {
    const r = await obtenerCambios();
  return Object.keys(r);
}
function mostrarCambios(cambios){
    const URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json'
    const $cambios = document.querySelector('#cambio tbody');
    $cambios.innerHTML = '';
    Object.keys(cambios).sort().forEach((moneda) => {
      const $fila = document.createElement('tr');
      const $moneda = document.createElement('td');
      const $cambio = document.createElement('td');
      $cambio.textContent = 'Cargando...';
      $moneda.textContent = 'Cargando...';
      $fila.appendChild($moneda);
      $fila.appendChild($cambio);
      $cambios.appendChild($fila);
      $cambio.textContent = cambios[moneda];
      fetch(URL).then(resp => resp.json()).then(function(data){
        let nombreDeMoneda = data[`${moneda}`];
        $moneda.textContent = nombreDeMoneda;
      })
    });
  }
function mostrarListadoMonedas(monedas, callbackSeleccionMoneda) {
    const URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json'
     const $lista = document.createElement('div'); 
     $lista.className = 'list-group';
     monedas.sort().forEach((base) => {
       const $item = document.createElement('a'); 
       $item.href = '#';
       $item.classList.add('list-group-item', 'list-group-item-action');
       fetch(URL).then(resp => resp.json()).then(function(data){
        let nombreDeMoneda = data[`${base}`];
        $item.textContent= nombreDeMoneda;
       })
       $item.dataset.base = base;
       $item.addEventListener('click', () => {
         const $itemActivo = document.querySelector('.list-group-item.active');
         if ($itemActivo) {
           $itemActivo.classList.remove('active');
         }
         $item.classList.add('active');
   
         callbackSeleccionMoneda(base);
       });
       $lista.appendChild($item);
     });
   
     document.querySelector('#monedas').appendChild($lista);
   }

   
async function actualizar() {
    mostrarCartelActualizacion();
    const cambios = await obtenerCambios(obtenerMonedaSeleccionada(), obtenerFechaSeleccionada());
    console.log(cambios)
    mostrarCambios(cambios);
  }



function obtenerFechaSeleccionada() {
    const fechaSeleccionada = document.querySelector('#fecha').value;
    return fechaSeleccionada || undefined;
  }


function mostrarCartelActualizacion() {
    document.querySelector('#cambio tbody').innerHTML = 'Cargando...';
  }

  function obtenerMonedaSeleccionada() {
    const $activeItem = document.querySelector('.list-group-item.active');
    if ($activeItem) {
      return document.querySelector('.list-group-item.active').dataset.base;
    }
  
    return undefined;
  }

function configurarInputFecha(callbackSeleccionFecha) {
    const $fecha = document.querySelector('#fecha');
  
    $fecha.setAttribute('max', (new Date()).toISOString().split('T')[0]);
    $fecha.addEventListener('change', callbackSeleccionFecha);
  }


mostrarListadoMonedas(await obtenerMonedas(), actualizar);
configurarInputFecha(actualizar);
  