// import { productos } from "./productos.js";
import { Contacto, contactoService } from "./contacto.js";
import { Carrito, carritoService } from "./carrito.js";

// Guarda los productos en memoria al hacer el primer Get 
let globalProductos = [];

class mainApp{

    // Actualiza en tiempo real el contador de items del carrito
    counterItemsShoppingCart(){

        // Se obtiene la lista de contactos del storage
        let arrayCarrito = JSON.parse(localStorage.getItem('carrito'));

        if (!arrayCarrito) {
            arrayCarrito = [];
        }

        $("#count").text(`${arrayCarrito.length}`);

    }

    // Construye el menu en el header dinamicamente
    buildMenu(){

        let secciones = [];
        let seccionesIndex = [
                                {
                                    texto: "Home",
                                    href: "index.html",
                                    delay: "data-wow-delay='0.2s'"
                                }, 
                                {
                                    texto: "Nosotros",
                                    href: "html/nosotros.html", 
                                    delay: "data-wow-delay='0.3s'"
                                }, 
                                { 
                                    texto: "Servicios",
                                    href: "html/servicios.html",
                                    delay: "data-wow-delay='0.4s'"
                                }, 
                                { 
                                    texto: "Galería",
                                    href: "html/galeria.html",
                                    delay: "data-wow-delay='0.5s'"
                                }, 
                                { 
                                    texto: "Contacto",
                                    href: "html/contacto.html",
                                    delay: "data-wow-delay='0.6s'"
                                }
                            ];
        let seccionesOtras = [
                                {
                                    texto: "Home",
                                    href: "../index.html",
                                    delay:""
                                }, 
                                {
                                    texto: "Nosotros",
                                    href: "../html/nosotros.html",
                                    delay:"" 
                                }, 
                                { 
                                    texto: "Servicios",
                                    href: "../html/servicios.html",
                                    delay:""
                                }, 
                                { 
                                    texto: "Galería",
                                    href: "../html/galeria.html",
                                    delay:""
                                }, 
                                { 
                                    texto: "Contacto",
                                    href: "../html/contacto.html",
                                    delay:""
                                }
                            ];

        // Obtiene el nombre de la pagina en la que estoy si es el index le paso 
        // el path de secciones y clases correspondiente                    
        let path = window.location.pathname;
        let page = path.split("/").pop();
        let page2 = page.split(".");
        let clasesMenu = "";
        let pagina = page2[0].toUpperCase();

        if (pagina === 'INDEX' || pagina === "") {    
            secciones = seccionesIndex;
            clasesMenu = "nav-link fw-bold text-uppercase menuSecciones wow animate__animated animate__bounceInDown";
        }
        else{
            secciones = seccionesOtras;
            clasesMenu = "nav-link fw-bold text-uppercase menuSecciones";
        }               

        // TERCERA FORMA JQUERY
        for (const seccion of secciones) {

            $("#menuHeader").append( `<li class="nav-item">
                                        <a class="${clasesMenu}" href="${seccion.href}" ${seccion.delay}>
                                            ${seccion.texto}
                                        </a>
                                      </li>`
                                    );

        }        
    }

    // Construye los productos obtenidos del .json y suscribe addShoppinCart
    buildProductos(){

        //Declaramos la url del archivo JSON local
        const URL_JSON_LOCAL = "../data/productos.json",
              URL_JSON_SERVER_GET = "http://localhost:3000/productos",
              dirImagen = "../images/carritoMakeup/"  

        // Se obtiene los productos del archivo .json cargado localmente
        $.get(URL_JSON_LOCAL, function (respuesta, estado) {

            if(estado === "success"){
                
                const productos = respuesta;
                globalProductos = respuesta;    
                
                for (const producto of productos) {

                    $("#mainServicioMakeup").append(`

                        <div class="col">
                            <div class="card h-100 w-75 card-ancho">
                                
                                <img src="${dirImagen + producto.imagen}" class="card-img-top img-fluid" loading="lazy" alt="${producto.descripcion}">
                                
                                <div class="card-body">
                                
                                    <div class="card-title pt-3 fw-bold productoMakeup text-center pb-3">
                                        ${producto.nombre}
                                    </div>
                                    
                                    <div class="h6 text-muted d-flex justify-content-center">
                                        <div>
                                            Precio:
                                        </div>
                                        <div class="ms-2">
                                            $${parseFloat(producto.precio).toFixed(2)}
                                        </div>
                                    </div>

                                    <div class="h6 text-muted d-flex justify-content-center">
                                        <label for="idCant-${producto.id}" class="">
                                            Cantidad:
                                        </label>
                                        <input id="idCant-${producto.id}" type="number" value="1" min="1" class="ms-1 ps-4 w-25 text-muted border border-secondary">
                                    </div>

                                    <div class="h6 text-muted d-flex justify-content-center">
                                        <label>
                                            Stock:
                                        </label>
                                        <div class="ms-1">${producto.stock} uds.</div>
                                    </div>

                                    <button id="${producto.id}" type="button" class="btn btn-dark w-100 mt-3">
                                        Agregar al carrito
                                        <i class="bi bi-cart3 ps-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
            
                    `);        
                    
                    // Suscribe el evento click al presionar boton carrito
                    $(`#${producto.id}`).click(eventHandlerAddShoppingCart) ;
                }
            }
        });

    }

    // Suscribe al evento submit del formulario de contacto
    eventHandlerSubmit() {
        
        // FORMA JQUERY
        $("#form-contacto").submit(function(event){

            // Se obtiene la lista de contactos del storage
            let contactos = JSON.parse(localStorage.getItem('contactos'));

            if(!contactos){
                contactos = [];
            }

            // Instancia la clase contactoService para hacer el crud
            const crudContacto = new contactoService(contactos, localStorage);

            // Previene el refresh por default
            event.preventDefault()

            const id = contactos.length + 1;
            const nombre = $("#nombre").val();
            const email = $("#email").val();
            const newsletter = $("#flexCheckChecked").val();

            // Verifica si ya existe contacto con ese nombre
            let contacto = crudContacto.read(nombre);
            let respuesta;

            // Si no existe lo crea
            if (!contacto) {
                // Se crea un nuevo contacto
                const newContacto = new Contacto(id, nombre, email, newsletter);
                crudContacto.create(newContacto);                
            }
            else {
                // Si existe actualiza
                crudContacto.update(contacto, email, newsletter);
            }  
            
            // Mensaje de Exito al enviar formulario
            $("#mensajeSubmit").show("slow",function(){
                $("#mensajeSubmit").fadeOut(2000);
            });

            $("#form-contacto").trigger("reset");
     
        });
    }    

    // Suscribe al evento Click icono fijo de carrito y boton iniciar compra en el modal
    eventHandlerDetalleShoppingCart(){

        // Suscribe al Evento Modal - Detalle del carrito
        $("#idCarrito").click( buildItemsInShoppingCart ) ;

        // Suscribe al Evento Iniciar Compra
        $("#comprar").click( iniciarCompra ) ;

    }

} // class mainApp

    // Agrega producto al carrito de compras presionando el icono carrito 
    // y agregando cantidad
    function eventHandlerAddShoppingCart(event) {
        
        let idProducto = parseInt(event.target.id);
        const dirImagen = "../images/carritoMakeup/";

        let itemCarrito=[];

        // Se obtiene el carrito del storage
        let carritoLocalStorage = JSON.parse(localStorage.getItem('carrito'));

        if(!carritoLocalStorage){
            carritoLocalStorage = [];
        }

        // Instancia la clase carritoService para hacer el crud
        const crudCarrito = new carritoService(carritoLocalStorage,localStorage);

        // Previene el refresh por default
        // event.preventDefault()

        const producto = globalProductos.find(producto => producto.id === idProducto);
        let cant = parseInt($(`#idCant-${idProducto}`).val());

        // Si ya existe el producto en el carrito suma la cantidad
        const itemProducto = carritoLocalStorage.find( item => item.id === idProducto);        

        // Actualiza cantidad
        if (itemProducto) {
            itemProducto.cantidad += cant;
            itemCarrito = new Carrito(producto.id, producto.nombre, itemProducto.cantidad, producto.precio, (dirImagen + producto.imagen));
            crudCarrito.update(itemCarrito);
        }
        // Agrega producto a carrito
        else{
            itemCarrito = new Carrito(producto.id, producto.nombre, cant, producto.precio, (dirImagen + producto.imagen));
            crudCarrito.create(itemCarrito);
        }


        // Actualiza en tiempo real el icono fijo contador del carrito de compras
        $("#count").text(`${crudCarrito.carrito.length}`);

        // Actualiza la cantidad del carrito de compras clickeado al valor default 1
        $(`#idCant-${idProducto}`).val("1");

    }

    // Construye el detalle de items en el modal
    function buildItemsInShoppingCart(){

        try {
    
            // Se obtiene la lista de items en el carrito del storage
            let carritoLocalStorage = JSON.parse(localStorage.getItem('carrito'));
            $(".separator").show();

            if(!carritoLocalStorage || carritoLocalStorage.length === 0 ){

                // Inicializamos el detalle
                $("#detalleCarrito").text("");
                $("#subTotal").text("");
                $("#total").text("");
                $(".separator").hide();
                
                $("#detalleCarrito").append("No existe nada cargado en el carrito");
                
                throw Error("No existe nada cargado en el carrito");
            
            }

            // Instancia la clase carritoService para hacer el crud
            const crudCarrito = new carritoService(carritoLocalStorage,localStorage);

            let subtotal=0.00;
            let envios = 1000.00;
            let total = 0.00;

            // Inicializamos el detalle
            $("#detalleCarrito").text("");

            // Agrega los item del carrito al modal
            for (const item of carritoLocalStorage) {

                subtotal += (item.precio * item.cantidad);

                // ITEMS - CARRITO
                $("#detalleCarrito").append(`
                
                    <div class="row row-cols-5 text-muted justify-content-center align-items-center pt-2">
                        <!-- Imagen -->
                        <div class="col-3">
                            <img src="${item.srcImagen}" class="img-fluid">
                        </div>
                        <!-- Producto -->
                        <div class="col-3">
                            <div class="fw-bold pb-2">
                                ${item.producto} 
                            </div>
                        </div>
                        <!-- Precio -->
                        <div class="col-2">
                            <div class="h6">
                                $${item.precio}
                            </div>
                        </div>
                        <!-- Cantidad -->
                        <div class="col-2">
                            <div class="h6">
                                ${item.cantidad} Unid.
                            </div>
                        </div>
                        <!-- Eliminar -->
                        <div id="delItem-${item.id}" class="col-2">
                            <button class="border-1 btn btn-secondary p-1">
                                X
                            </button>
                        </div>    
                    </div>                        
                `);     

                $(`#delItem-${item.id}`).click( function(){

                    crudCarrito.delete(item.id, carritoLocalStorage);
                    buildItemsInShoppingCart();

                    let count = 0;
                    let cart = JSON.parse(localStorage.getItem('carrito'));
                    
                    if (cart) {
                        count = cart.length;    
                    }
                    
                    $("#count").text(count);  
                
                });
            }

            total = subtotal + envios;

            // SUBTOTAL
            $("#subTotal").text("");
            $("#subTotal").append(`  
                <div class="row row-cols-2 text-muted justify-content-center align-items-center">
                    <!-- Subtotal -->
                    <div class="col-9">
                        <div class="fw-bold">
                            Subtotal
                        </div>
                    </div>
                    <!-- Valor -->
                    <div class="col-3">
                        <div class="h6">
                            $${parseFloat(subtotal).toFixed(2)}
                        </div>
                    </div>
                    <!-- Envios -->
                    <div class="col-9">
                        <div class="fw-bold">
                            Envios
                        </div>
                    </div>
                    <!-- Valor -->
                    <div class="col-3">
                        <div class="h6">
                            $${parseFloat(envios).toFixed(2)}
                        </div>
                    </div>
                </div>                
            `);        

            // TOTAL
            $("#total").text("");
            $("#total").append(`  
                <div class="row row-cols-2 text-muted justify-content-center align-items-center">
                    <!-- Total -->
                    <div class="col-9">
                        <div class="fw-bold">
                            TOTAL
                        </div>
                    </div>
                    <!-- Valor -->
                    <div class="col-3">
                        <div class="h6">
                            $${parseFloat(total).toFixed(2)}
                        </div>
                    </div>
                </div>                
            `);

        } catch (error) {
            console.log(error);
        }            

    }

    // Al presionar Iniciar compra actualiza el localStorage y el contador
    function iniciarCompra(){

        let key; 
        for (let i = 0; i < localStorage.length; i++) {   
                
            key = localStorage.key(i);   
                
            if(key == "carrito"){ 
                localStorage.removeItem(key);
            }

        }

        $("#count").text("0"); 

    }

// MAIN
$(document).ready(function() {

    const app = new mainApp();
    app.buildMenu();
    app.buildProductos();
    app.eventHandlerSubmit();
    app.counterItemsShoppingCart();
    app.eventHandlerDetalleShoppingCart();

});