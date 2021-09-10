class Carrito {

    constructor(id, producto, cantidad, precio, pathImagen) {
        
        this.id = id;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precio = precio;
        this.srcImagen = pathImagen;
        // this.precioTotal = precio * cantidad;
    
    }

} // class Carrito

// Clase de Servicio que crea,lee,actualiza y elimina un Carrito
class carritoService {

    constructor(carrito,localStorage){

        this.carrito = carrito;
        this.localStorage = localStorage;

    }
    
    // Agrega un nuevo Carrito a la lista de Carritos y lo persiste en el storage
    create(carrito) {

        this.carrito.push(carrito);
        this.localStorage.setItem('Carrito', JSON.stringify(this.carrito));
    
    }

    // Encuentra un Carrito por su nombre
    // read(nombre) {
        
    //     const CarritoOne = this.Carritos.find( Carrito => Carrito.nombre === nombre.toLowerCase());

    //     // if (!CarritoOne) {
    //     //     throw Error('No existe Carrito con ese Nombre');
    //     // }
    //     return CarritoOne;

    // }

    // // Actualiza un Carrito por su nombre
    // update(Carrito,email,newsletter) {
        
    //     Carrito.email = email;
    //     Carrito.newsletter = newsletter;
    //     this.localStorage.setItem('Carritos', JSON.stringify(this.Carritos));
    
    // }

    // // Elimina un Carrito por su id
    // delete(nombre) {
    
    //     const usuario = this.read(nombre);
    //     const index = this.Carritos.findIndex( Carrito => Carrito.id === usuario.id );

    //     if (index >= 0) {
    //         this.Carritos.splice(index, 1)
    //     }

    //     // localStorage.setItem('Carritos', JSON.stringify(Carritos))
    
    // }

    // // Obtiene todos los Carritos
    // getAll(){

    //     return this.carrito;

    // }

} // class CarritoService

