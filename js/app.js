const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');
const registrosPorPagina = 40;
const paginacionDiv = document.querySelector('#paginacion');
let totalPaginas;
let iterador;
let paginaActual = 1;

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
};

function validarFormulario(e){
    e.preventDefault(); 

    const terminoBusqueda =  document.querySelector('#termino').value;
    if(terminoBusqueda === ''){
        mostrarAlerta('Agrega un termino de busqueda');
        return;
    }
    buscarImagenes();
};

function buscarImagenes(){
    const termino =  document.querySelector('#termino').value;
    const key = '34274561-84b93148e768e0fda4b3db506';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url).then(respuesta => respuesta.json()).then(resultado => {
        totalPaginas = calcularPaginas(resultado.totalHits);
        mostrarImagenes(resultado.hits);
    });
};

//generador de paginas
function *creaPaginador(total){
    for( let i = 1; i <= total; i++){
        yield i;
    };
};

function calcularPaginas(total){
    return parseInt(Math.ceil(total / registrosPorPagina));
};

function mostrarImagenes(imagenes){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    };

    //iterar en el array de img y construir el HTML
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;
        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">   
                <img class="w-full" src="${previewURL}">
                <div class="p-4">
                    <p class="font-bold">${likes}<span class="font-light"> Me Gusta</span></p>
                    <p class="font-bold">${views}<span class="font-light"> Veces Vista</span></p>
                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen HD</a>
                </div>
            </div>
        </div>
        `;
    });
    //LIMPIAR HTML
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    };
    //GENERAR HTML NUEVO
    imprimirPaginador();
};

function imprimirPaginador(){
    iterador = creaPaginador(totalPaginas);
    while(true){
        const {value, done} = iterador.next(); 
        if(done) return;
        
        const boton = document.createElement('A');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-1', 'rounded');
        boton.onclick = () => {
            paginaActual = value;
            buscarImagenes();
        };
        paginacionDiv.appendChild(boton);
    };
};

function mostrarAlerta(mensaje){
    const existeAlerta = document.querySelector('.bg-red-100');
    if(existeAlerta){
        return;
    };

    const alerta = document.createElement('P');
    alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    alerta.innerHTML = `
        <strong class="font-bold">ERROR!</strong>
        <span class="block sm:inline">${mensaje}</span>
    `;
    formulario.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
};