class mainApp{

    constructor(document,localStorage){
        
        this.contactos = [];
        this.carrito = [];
        this.document = document;
        this.localStorage = localStorage;
    
    }

    wait(ms){

        let start = new Date().getTime();
        let end = start;

        while(end < start + ms) {
            end = new Date().getTime()
        };

    }

    counterItemsShoppingCart(){

        // Se obtiene la lista de contactos del storage
        let arrayCarrito = JSON.parse(localStorage.getItem('Carrito'));

        if (!arrayCarrito) {
            arrayCarrito = [];
        }

        const spanCounterCart = document.getElementById('count');
        spanCounterCart.textContent = arrayCarrito.length;

    }

    getElementOnNodeById(parentNode,id) {
                
        const hijos = parentNode.childNodes;
                
        for (let index = 0; index < hijos.length; index++) {
                   
            const element = hijos[index];
            
            if (element.id === id) {
                
                return element ;
            }
        }
    }

    getElementOnNode(parentNode,tagName) {
                
        const hijos = parentNode.childNodes;
                
        for (let index = 0; index < hijos.length; index++) {
                   
            const element = hijos[index];
            
            if (element.tagName === tagName) {
                
                return element ;
            }
        }
    }

    getValueElementOnNode(parentNode,tagName) {
                
        const hijos = parentNode.childNodes;
                
        for (let index = 0; index < hijos.length; index++) {
                   
            const element = hijos[index];
            
            if (element.tagName === tagName) {
                
                // const value = element.innerText;
                let value = element.textContent;

                if (element.tagName == 'IMG') {
                    value = element.getAttribute("src");
                    return value;
                }

                if (!value) {
                    value = element.value;
                }

                return value.trim() ;
            }
        }
    }

    buildMenu(){
        
        const ulMenuHeader = document.getElementById('menuHeader');
        let secciones = [
                            {
                                texto: "Home",
                                href: "../index.html"
                            }, 
                            {
                                texto: "Nosotros",
                                href: "../html/nosotros.html" 
                            }, 
                            { 
                                texto: "Servicios",
                                href: "../html/servicios.html"
                            }, 
                            { 
                                texto: "Galería",
                                href: "../html/galeria.html"
                            }, 
                            { 
                                texto: "Contacto",
                                href: "../html/contacto.html"
                            }
                        ];

        for (let i = 0; i < secciones.length; i++) {
        
            // Crea dinamicamente los <li><li/> del menu en el header
            let itemMenu = this.document.createElement('li');
            itemMenu.id = secciones[i].texto + 1;
            itemMenu.className = "nav-item";

            ulMenuHeader.appendChild(itemMenu);

            // Crea los <a><a/>
            const liMenuHeader = document.getElementById(itemMenu.id);

            let aMenuHeader = this.document.createElement('a');
            aMenuHeader.textContent = `${ secciones[i].texto }`;
            // aMenuHeader.id = secciones[i] + 1;
            aMenuHeader.href = secciones[i].href;
            aMenuHeader.className = "nav-link fw-bold text-uppercase menuSecciones";

            liMenuHeader.appendChild(aMenuHeader);

        }
    }

    eventHandlerSubmit() {

        // Se obtiene la lista de contactos del storage
        this.contactos = JSON.parse(localStorage.getItem('contactos'));

        if(!this.contactos){
            this.contactos = [];
        }

        // Instancia la clase contactoService para hacer el crud
        const crudContacto = new contactoService(this.contactos,this.localStorage);

        // Accedo al DOM a obtener los elementos del formulario
        const formContacto = this.document.getElementById('form-contacto');
        const inputNombre  = this.document.getElementById('nombre');
        const inputEmail   = this.document.getElementById('email');
        const checkNewsletter = this.document.getElementById('flexCheckChecked');

        // Previene el refresh por default
        // event.preventDefault()

        // Escucho los eventos de submit del form para agregar contactos nuevos al storage
        formContacto.addEventListener('submit', (event) => {

            // Previene el refresh por default
            // event.preventDefault()

            const id = this.contactos.length + 1;
            const nombre = inputNombre.value;
            const email = inputEmail.value;
            const newsletter = checkNewsletter.value;

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

        })
        
    }

    // Agregar producto al carrito de compras presionando el icono carrito 
    // y agregando cantidad
    eventHandlerShoppingCart() {

        // Instancia la clase carritoService para hacer el crud
        const crudCarrito = new carritoService(this.carrito,this.localStorage);

        // Obtiene todos los elementos donde esta el icono carrito
        const cIconoCarrito = this.document.querySelectorAll(".iconoCarrito");

        // Obtiene el id de contador de items en carrito de compras para actualizarlo
        const contadorItems = this.document.getElementById('count');

        // Se agrega al evento click todos los productos
        for (let i = 0; i < cIconoCarrito.length; i++) {

            cIconoCarrito[i].addEventListener("click", function(event) {

                // Se obtiene el carrito del storage
                let carritoLocalStorage = JSON.parse(localStorage.getItem('Carrito'));

                if(!carritoLocalStorage){
                    carritoLocalStorage = [];
                }

                // Previene el refresh por default
                // event.preventDefault()

                console.log(event);
                const main = new mainApp(document,localStorage);

                // Nodo donde se encuentra la cantidad del carrito
                const spanElement = this.parentElement;
                const divParentNode = spanElement.parentElement;

                // Obtiene el nodo padre donde se encuentra la info del producto
                const divParentNodeCart = divParentNode.parentElement;

                // Actualiza status carrito a Agregagndo...
                // let statusCarrito = main.getElementOnNodeById(divParentNode,'statusCarrito');
                // statusCarrito.textContent = "Agregando...";
                // main.wait(9000);

                // Id
                const id = carritoLocalStorage.length + 1;    

                // Obtiene el src de la image
                let srcImagen = main.getValueElementOnNode(divParentNodeCart,"IMG"); 
                console.log(srcImagen);

                // Obtiene el producto
                let producto = main.getValueElementOnNode(divParentNodeCart,"DIV"); 
                console.log(producto);

                // Obtiene el precio
                let precio = main.getValueElementOnNode(divParentNodeCart,"SPAN"); 
                console.log(precio);

                // Obtiene la cantidad
                let cantidad = parseInt(main.getValueElementOnNode(divParentNode,"INPUT")); 
                console.log(cantidad);

                const itemCarrito = new Carrito(id, producto, cantidad, precio, srcImagen);
                crudCarrito.create(itemCarrito);
                
                // Actualiza status carrito a  Listo
                // statusCarrito.textContent = "Listo";
                // main.wait(1000);
                // statusCarrito.textContent = "";

                // Actualiza en tiempo real el icono fijo contador del carrito de compras
                contadorItems.textContent = crudCarrito.carrito.length;

                // Actualiza la cantidad del carrito de compras clickeado al valor default 1
                let elementCantidad = main.getElementOnNode(divParentNode,"INPUT"); 
                elementCantidad.value = 1;
                console.log(elementCantidad);

            });
        
        }
            
    }

    // Se ejecuta cuando presiono el icono fijo de carrito de compras
    // y el boton Iniciar compra en el detalle de items en el carrito de compras
    eventHandlerDetalleShoppingCart(){

        // Accedo al DOM a obtener el id que despliega el modal con el detalle del carrito
        // el elemento es el carrito fijo en el sitio
        const modal = this.document.getElementById('idCarrito');
        
        // Elemento contiene todo el detalle de los items del carrito
        const bodyModal = this.document.getElementById('detalleCarrito');

        // Elemento contiene todo el detalle de los items del carrito
        const totalHtml = this.document.getElementById('total');

        // Evento click al presionar el boton comprar en el detalle de Shopping Cart
        const comprar = this.document.getElementById('comprar'); 

        // Contador de Items del carrito
        const count = this.document.getElementById('count'); 
        
        comprar.addEventListener('click', (event) => {

            // Se obtiene la lista de items en el carrito del storage
            let carritoLocalStorage = JSON.parse(this.localStorage.getItem('Carrito'));
            // this.localStorage.clear();
            let key; 
            for (let i = 0; i < this.localStorage.length; i++) {   
                key = this.localStorage.key(i);   
                if(key == "Carrito"){ 
                    this.localStorage.removeItem(key);
                }
             }

            count.textContent = 0;    

        })

        // Evento Click en el icono Shopping Cart fijo en el sitio
        modal.addEventListener('click', (event) => {

            let subtotal = 0;
            let precioTotalItem = 0;

            bodyModal.innerHTML = "";
            totalHtml.innerHTML = "";

            // Se obtiene la lista de items en el carrito del storage
            let carritoLocalStorage = JSON.parse(this.localStorage.getItem('Carrito'));

            if(!carritoLocalStorage){
                throw Error("No existe nada cargado en el carrito");
            }

            // Recorre todos los items del carrito y crea el html para mostrarlo en el modal
            for (let index = 0; index < carritoLocalStorage.length; index++) {
                
                precioTotalItem = 1000 * parseInt(carritoLocalStorage[index].cantidad);
                subtotal += precioTotalItem;

                // DIV ROW
                let divCart = this.document.createElement('div');
                divCart.id = carritoLocalStorage[index].id;
                divCart.className = "row pt-2 justify-content-center align-items-center";

                bodyModal.appendChild(divCart);

                // DIV COL1 - IMAGEN
                let divCol1 = this.document.createElement('div');
                divCol1.id = index;
                divCol1.className = "col-4";

                divCart.appendChild(divCol1);

                // Crea el tag <img>
                const divTag = this.document.getElementById(divCol1.id);

                let imgTag = this.document.createElement('img');
                // aMenuHeader.textContent = `${ secciones[i].texto }`;
                // aMenuHeader.id = secciones[i] + 1;
                imgTag.src = carritoLocalStorage[index].srcImagen;
                imgTag.className = "img-fluid" ;

                divCol1.appendChild(imgTag);

                // DIV COL2 - PRODUCTO
                let divCol2 = this.document.createElement('div');
                divCol2.id = index;
                divCol2.className = "col-4";

                divCart.appendChild(divCol2);

                // Crea el tag <div>Producto</div>
                let divProducto = this.document.createElement('div');
                divProducto.textContent = carritoLocalStorage[index].producto;
                // aMenuHeader.id = secciones[i] + 1;
                divProducto.className = "pt-3 fw-bold text-muted";

                divCol2.appendChild(divProducto);

                // DIV COL3 - PRECIO
                let divCol3 = this.document.createElement('div');
                divCol3.id = index;
                divCol3.className = "col-2";

                divCart.appendChild(divCol3);

                // Crea el tag <div>Precio</div>
                let divPrecio = this.document.createElement('div');
                divPrecio.textContent = carritoLocalStorage[index].precio;
                // aMenuHeader.id = secciones[i] + 1;
                divPrecio.className = "h6 text-muted";

                divCol3.appendChild(divPrecio);

                // DIV COL4 - CANTIDAD 
                let divCol4 = this.document.createElement('div');
                divCol4.id = index;
                divCol4.className = "col-2";

                divCart.appendChild(divCol4);

                // Crea el tag <div>Cantidad</div>
                let divCantidad = this.document.createElement('div');
                divCantidad.textContent = `${carritoLocalStorage[index].cantidad} Unid.`;
                // aMenuHeader.id = secciones[i] + 1;
                divCantidad.className = "h6 text-muted";

                divCol4.appendChild(divCantidad);

            }

            // SUBTOTAL - DIV ROW
            let divSubtotal = this.document.createElement('div');
            divSubtotal.className = "row justify-content-center align-items-center";

            totalHtml.appendChild(divSubtotal);

            // DIV COL1 - Texto Subtotal
            let divSubCol1 = this.document.createElement('div');
            // divSubCol1.id = index;
            divSubCol1.textContent = "Subtotal";
            divSubCol1.className = "col-9 pt-2 ps-5 fw-bold text-muted";

            divSubtotal.appendChild(divSubCol1);

            // DIV COL2 - Valor Subtotal
            let divSubCol2 = this.document.createElement('div');
            // divSubCol1.id = index;
            divSubCol2.textContent = `$${parseFloat(subtotal).toFixed(2)}` ;
            divSubCol2.className = "col h6 text-muted";

            divSubtotal.appendChild(divSubCol2);

            // ENVIOS - DIV ROW
            let divEnvios = this.document.createElement('div');
            divEnvios.className = "row justify-content-center align-items-center";

            totalHtml.appendChild(divEnvios);

            // DIV COL1 - Texto Envios
            let divEnvCol1 = this.document.createElement('div');
            // divSubCol1.id = index;
            divEnvCol1.textContent = "Envios";
            divEnvCol1.className = "col-9 pt-2 ps-5 fw-bold text-muted";

            divEnvios.appendChild(divEnvCol1);

            // DIV COL2 - Valor Envios
            let divEnvCol2 = this.document.createElement('div');
            // divSubCol1.id = index;
            divEnvCol2.textContent = "$1.000,00";
            divEnvCol2.className = "col h6 text-muted";

            divEnvios.appendChild(divEnvCol2);

            // TOTAL - DIV ROW
            let divTotal = this.document.createElement('div');
            divTotal.className = "row justify-content-center align-items-center";

            totalHtml.appendChild(divTotal);

            // DIV COL1 - Texto Total
            let divTotalCol1 = this.document.createElement('div');
            // divSubCol1.id = index;
            divTotalCol1.textContent = "Total";
            divTotalCol1.className = "col-9 pt-2 ps-5 fw-bold text-muted";

            divTotal.appendChild(divTotalCol1);

            // DIV COL2 - Valor Total
            let divTotalCol2 = this.document.createElement('div');
            // divSubCol1.id = index;
            divTotalCol2.textContent = `$${parseFloat((subtotal + 1000)).toFixed(2)}`;
            divTotalCol2.className = "col h6 text-muted";

            divTotal.appendChild(divTotalCol2);            

        })

    }

} // class mainApp
