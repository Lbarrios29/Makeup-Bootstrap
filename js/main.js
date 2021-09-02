class mainApp{

    constructor(document,localStorage){
        
        this.contactos = [];
        this.document = document;
        this.localStorage = localStorage;
    
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

    handleSubmitEvent() {

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

} // class mainApp


// PROGRAMA DE CONTROL PRINCIPAL //
// Llamada principal 
// const app = new mainApp(document,localStorage);
// app.handleSubmitEvent();
// app.buildMenu();