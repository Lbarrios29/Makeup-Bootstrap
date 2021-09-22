class Contacto {

    constructor(id, nombre, email, newsletter) {
        
        this.id = id;
        this.nombre = nombre.toLowerCase();
        this.email = email.toLowerCase();
        this.newsletter = newsletter;
    
    }

} // class Contacto

// Clase de Servicio que crea,lee,actualiza y elimina un Contacto
class contactoService {

    constructor(contactos,localStorage){

        this.contactos = contactos;
        this.localStorage = localStorage;

    }
    
    // Agrega un nuevo contacto a la lista de contactos y lo persiste en el storage
    create(contacto) {

        // Envia el contacto al Local Storage
        this.contactos.push(contacto);
        this.localStorage.setItem('contactos', JSON.stringify(this.contactos));
    
        // POST
        const URL_JSON_POST = "https://jsonplaceholder.typicode.com/posts";
        
        const contactoData = { id: `${contacto.id}`, nombre:`${contacto.nombre}`, email:`${contacto.email}`};

        $.post(URL_JSON_POST, contactoData, function (respuesta, estado) {
            
            if(estado === "success"){
                console.log(respuesta);
            }

        })

    }

    // Encuentra un contacto por su nombre
    read(nombre) {
        
        const contactoOne = this.contactos.find( contacto => contacto.nombre === nombre.toLowerCase());

        // if (!contactoOne) {
        //     throw Error('No existe contacto con ese Nombre');
        // }
        return contactoOne;

    }

    // Actualiza un contacto por su nombre
    update(contacto,email,newsletter) {
        
        contacto.email = email;
        contacto.newsletter = newsletter;
        this.localStorage.setItem('contactos', JSON.stringify(this.contactos));
     
    }

    // Elimina un contacto por su id
    delete(nombre) {
    
        const usuario = this.read(nombre);
        const index = this.contactos.findIndex( contacto => contacto.id === usuario.id );

        if (index >= 0) {
            this.contactos.splice(index, 1)
        }

        // localStorage.setItem('contactos', JSON.stringify(contactos))
    
    }

    // Obtiene todos los contactos
    getAll(){

        return this.contactos;

    }

} // class ContactoService

export { Contacto,
        contactoService } 

