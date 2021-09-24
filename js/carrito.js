class Carrito {

    constructor(id, producto, cantidad, precio, pathImagen) {
        
        this.id = id;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precio = parseFloat(precio).toFixed(2);
        this.srcImagen = pathImagen;
    
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
        this.localStorage.setItem('carrito', JSON.stringify(this.carrito));
    
    }

    // Encuentra un Carrito por su nombre
    read(id,carrito) {
        
        const carritoOne = carrito.find( item => item.id === id);

        if (!carritoOne) {
            throw Error('No existe Carrito con ese Id');
        }
        return carritoOne;

    }

    // Actualiza un Carrito por su nombre
    update(item) {
        
        const index = this.carrito.findIndex( itemCarrito => itemCarrito.id === item.id );
        // carrito.cantidad = cantidad;
        this.carrito[index].cantidad = item.cantidad;
        this.localStorage.setItem('carrito', JSON.stringify(this.carrito));
    
    }

    // Elimina un Carrito por su id
    delete(id,carrito) {
    
        const item = this.read(id,carrito);
        const index = carrito.findIndex( producto => producto.id === item.id );

        if (index >= 0) {
            carrito.splice(index, 1)
        }

        if (carrito.length == 0) {
            this.localStorage.clear();            
        }
        else{
            this.localStorage.setItem('carrito', JSON.stringify(carrito));
        }
    
    }

    // // Obtiene todos los Carritos
    // getAll(){

    //     return this.carrito;

    // }

} // class CarritoService

export { Carrito,
        carritoService } 

