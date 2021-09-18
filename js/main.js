import { productos } from "./productos.js";
import { Contacto, contactoService } from "./contacto.js";
import { Carrito, carritoService } from "./carrito.js";

class mainApp{

    constructor(document){
        
        this.contactos = [];
        this.carrito = [];
        this.document = document;
    
    }

    counterItemsShoppingCart(){

        // Se obtiene la lista de contactos del storage
        let arrayCarrito = JSON.parse(localStorage.getItem('carrito'));

        if (!arrayCarrito) {
            arrayCarrito = [];
        }

        $("#count").text(`${arrayCarrito.length}`);

    }

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

         if (pagina === 'INDEX') {    
            secciones = seccionesIndex;
            clasesMenu = "nav-link fw-bold text-uppercase menuSecciones wow animate__animated animate__bounceInDown";
         }
         else{
            secciones = seccionesOtras;
            clasesMenu = "nav-link fw-bold text-uppercase menuSecciones";
         }               

        // SEGUNDA FORMA JS VANILLA MEJORADA
        //Creamos una variable que va a iniciar como un string vacio
        /*let html = '';
        for (const seccion of secciones) {

            html += `<li class="nav-item">
                        <a class="${clasesMenu}" href="${seccion.href}" ${seccion.delay}>
                            ${seccion.texto}
                        </a>
                    </li>`;

        }

        //Luego que termina de iterar el for lo agregamos todo con el innerHTML
        ulMenuHeader.innerHTML = html;*/

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

    buildProductos(){

        for (const producto of productos) {

            $(".mainServicioMakeup").append(`
                <div>
                    <img src="${producto.srcImagen}" alt="${producto.alt}"
                        loading="lazy" class="img-fluid">
                    <div class="h5 pt-3 fw-bold productoMakeup">
                        ${producto.nombre}
                    </div>
                    <span class="h6 text-muted">
                        $${parseFloat(producto.precio).toFixed(2)}
                    </span>
                    <div class="d-flex pt-3">
                        <input id="idCant${producto.id}" type="number" value="1" min="1" class="cantidadCarrito">
                        <span class="ps-4">
                            <i id="${producto.id}" class="bi bi-cart3 iconoCarrito"></i>
                        </span>
                    </div>
                </div>            
            `);        
        }
    }

    eventHandlerSubmit() {
        
        // FORMA JQUERY
        $("#form-contacto").submit(function(event){

            // Se obtiene la lista de contactos del storage
            this.contactos = JSON.parse(localStorage.getItem('contactos'));

            if(!this.contactos){
                this.contactos = [];
            }

            // Instancia la clase contactoService para hacer el crud
            const crudContacto = new contactoService(this.contactos, localStorage);

            // Previene el refresh por default
            //event.preventDefault()

            const id = this.contactos.length + 1;
            const nombre = $("#nombre").val();
            const email = $("#email").val();
            const newsletter = $("#flexCheckChecked").val();

            // Verifica si ya existe contacto con ese nombre
            let contacto = crudContacto.read(nombre);

            // Si no existe lo crea
            if (!contacto) {
                // Se crea un nuevo contacto
                const contacto = new Contacto(id, nombre, email, newsletter);
                crudContacto.create(contacto);                
            }
            else {
                // Si existe actualiza
                crudContacto.update(contacto, email, newsletter);
            }            
        });
    }

    // Agregar producto al carrito de compras presionando el icono carrito 
    // y agregando cantidad
    eventHandlerShoppingCart() {
        
        // FORMA CON JQUERY
        for (const producto of productos) {

            $(`#${producto.id}`).click( function(event){
                
                // Se obtiene el carrito del storage
                let carritoLocalStorage = JSON.parse(localStorage.getItem('carrito'));

                if(!carritoLocalStorage){
                    carritoLocalStorage = [];
                }

                // Instancia la clase carritoService para hacer el crud
                const crudCarrito = new carritoService(carritoLocalStorage,localStorage);

                // Previene el refresh por default
                // event.preventDefault()

                let cant = $(`#idCant${producto.id}`).val();
                const itemCarrito = new Carrito(producto.id, producto.nombre, cant, producto.precio, producto.srcImagen);
                crudCarrito.create(itemCarrito);

                // Actualiza en tiempo real el icono fijo contador del carrito de compras
                $("#count").text(`${crudCarrito.carrito.length}`);

                // Actualiza la cantidad del carrito de compras clickeado al valor default 1
                $(`#idCant${producto.id}`).val("1");

            });            

        }

    }

    // Se ejecuta cuando presiono el icono fijo de carrito de compras
    // y el boton Iniciar compra en el detalle de items en el carrito de compras
    eventHandlerDetalleShoppingCart(){

        // FORMA JQUERY
        
        // Evento Iniciar Compra 
        $("#comprar").click( function(event) {

            let key; 
            for (let i = 0; i < localStorage.length; i++) {   
                
                key = localStorage.key(i);   
                
                if(key == "carrito"){ 
                    localStorage.removeItem(key);
                }

             }

            $("#count").text("0");    

        })

        // Evento Modal - Detalle del carrito
        $("#idCarrito").click( buildItemsShoppingCart ) ;

    }

} // class mainApp

    function buildItemsShoppingCart(){

        try {
    
            // Se obtiene la lista de items en el carrito del storage
            let carritoLocalStorage = JSON.parse(localStorage.getItem('carrito'));

            if(!carritoLocalStorage){
                // Inicializamos el detalle
                $("#detalleCarrito").text("");
                $("#total").text("");
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

                $("#detalleCarrito").append(`

                    <div id="item-${item.id}" class="row pt-2 justify-content-center align-items-center">
                        <!-- Imagen -->
                        <div class="col-3">
                            <img src= "${item.srcImagen}" class="img-fluid">
                        </div>
                        <!-- Producto -->
                        <div class="col-3">
                            <div class="pt-3 fw-bold text-muted"> 
                                ${item.producto} 
                            </div>
                        </div>
                        <!-- Precio -->
                        <div class="col-2">
                            <div class="h6 text-muted"> 
                                $${item.precio} 
                            </div>
                        </div>
                        <!-- Cantidad -->
                        <div class="col-2">
                            <div class="h6 text-muted">
                                ${item.cantidad} Unid. 
                            </div>
                        </div>   
                        <!-- Eliminar -->
                        <div id="col-${item.id}" class="col-2">
                            <button class="h6 text-muted p-1">
                                X 
                            </button>
                        </div>                                                
                    </div>
                
                `);     
                
                // Suscribe al evento eliminar
                $(`#col-${item.id}`).click( function(){

                    crudCarrito.delete(item.id, carritoLocalStorage);
                    // $("#total").text("");
                    buildItemsShoppingCart();
                    let count = 0;
                    let cart = JSON.parse(localStorage.getItem('carrito'));
                    if (cart) {
                        count = cart.length;    
                    }
                    $("#count").text(count);  
                
                });
            }

            total = subtotal + envios;
            $("#total").text("");
            $("#total").append(`
                <!-- Subtotal -->
                <div class="row justify-content-center align-items-center">
                    <div class="col-9 pt-2 ps-5 fw-bold text-muted">
                        Subtotal
                    </div>
                    <div class="col h6 text-muted">
                        $${parseFloat(subtotal).toFixed(2)}
                    </div> 
                </div>
                <!-- Envios -->
                <div class="row justify-content-center align-items-center">
                    <div class="col-9 pt-2 ps-5 fw-bold text-muted">
                        Envios
                    </div>
                    <div class="col h6 text-muted">
                        $${parseFloat(envios).toFixed(2)}
                    </div> 
                </div>    
                <!-- Total -->
                <div class="row justify-content-center align-items-center">
                    <div class="col-9 pt-2 ps-5 fw-bold text-muted">
                        Total
                    </div>
                    <div class="col h6 text-muted">
                        $${parseFloat(total).toFixed(2)}
                    </div> 
                </div>             
            `);        

        } catch (error) {
            console.log(error);
        }            

        }

// MAIN
// $( document ).ready(function() {
window.onload = () => {    
    const app = new mainApp(document, localStorage);
    app.buildMenu();
    app.buildProductos();
    app.eventHandlerSubmit();
    app.eventHandlerShoppingCart();
    app.counterItemsShoppingCart();
    app.eventHandlerDetalleShoppingCart();
}
    // });