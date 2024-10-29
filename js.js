// Obtener los elementos del DOM
const iconoCarrito = document.getElementById('cart-icon');
const btnCerrarCarrito = document.getElementById('cart-close-btn');
const contenedorCarrito = document.getElementById('cart-container');
const itemsCarrito = document.getElementById('cart-items');
const totalCarrito = document.getElementById('cart-total');
const btnFinalizarCompra = document.getElementById('checkout-btn');
const contadorCarrito = document.getElementById('cart-count'); // Contador de productos

// Variable para almacenar los productos del carrito
let carrito = [];

// Mostrar/ocultar el carrito al hacer clic en el ícono
iconoCarrito.addEventListener('click', () => {
  contenedorCarrito.classList.toggle('cart-visible'); // Alternar visibilidad
});

// Cerrar el carrito al hacer clic en el botón de cierre
btnCerrarCarrito.addEventListener('click', () => {
  if (contenedorCarrito.classList.contains('cart-visible')) {
    contenedorCarrito.classList.remove('cart-visible'); // Ocultar carrito
  }
});

// Cargar productos desde un archivo JSON
fetch('./productos.json')
  .then(response => response.json())
  .then(data => {
    const contenedorProductos = document.getElementById('products-container');

    // Crear tarjetas de productos dinámicamente
    data.productos.forEach(producto => {
      const tarjeta = document.createElement('div');
      tarjeta.classList.add('card');
      tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h1>${producto.nombre}</h1>
        <p class="txt-card">${producto.descripcion}</p>
        <p class="txt-card-v">Bs. ${producto.precio}</p>
        <button class="btn-2 agregar-carrito"
          data-id="${producto.nombre}"
          data-nombre="${producto.nombre}"
          data-precio="${producto.precio}">
          Añadir al Carrito
        </button>
      `;
      contenedorProductos.appendChild(tarjeta);
    });

    // Agregar eventos a los botones de "Añadir al Carrito"
    document.querySelectorAll('.agregar-carrito').forEach(boton => {
      boton.addEventListener('click', (event) => {
        const botonPresionado = event.target;
        const producto = {
          id: botonPresionado.getAttribute('data-id'),
          nombre: botonPresionado.getAttribute('data-nombre'),
          precio: parseFloat(botonPresionado.getAttribute('data-precio'))
        };
        agregarAlCarrito(producto); // Añadir producto al carrito
        mostrarConfirmacion();
      });
    });
    

// ----------------------------

function mostrarConfirmacion() {
  const confirmacion = document.getElementById('confirmacionCarrito');
  const overlay = document.querySelector('.confirmacion-overlay');
  confirmacion.classList.add('show');
  overlay.classList.add('show');

  // Cerrar la confirmación automáticamente después de 2 segundos
  setTimeout(() => {
    cerrarConfirmacion();
  }, 2000);
}

// Función para cerrar la confirmación
function cerrarConfirmacion() {
  const confirmacion = document.getElementById('confirmacionCarrito');
  const overlay = document.querySelector('.confirmacion-overlay');
  confirmacion.classList.remove('show');
  overlay.classList.remove('show');
} 
document.getElementById('cerrarConfirmacion').addEventListener('click', cerrarConfirmacion);   
  })
  .catch(error => console.error('Error al cargar productos:', error));

// Función para añadir productos al carrito
function agregarAlCarrito(producto) {
  // Verificar si el producto ya existe en el carrito
  const productoExistente = carrito.find(item => item.id === producto.id);

  if (productoExistente) {
    // Si ya existe, aumentar la cantidad
    productoExistente.cantidad += 1;
  } else {
    // Agregar un nuevo producto como un objeto independiente
    carrito.push({ 
      id: producto.id, 
      nombre: producto.nombre, 
      precio: producto.precio, 
      cantidad: 1 
    });
  }

  actualizarCarrito(); // Actualizar el carrito después de cada cambio
}

// Función para actualizar el carrito (HTML y totales)
function actualizarCarrito() {
  itemsCarrito.innerHTML = ''; // Limpiar contenido previo
  let total = 0;
  let totalProductos = 0;

  // Generar cada elemento del carrito
  carrito.forEach(producto => {
    totalProductos += producto.cantidad;
    const item = document.createElement('li');
    item.classList.add('cart-item');
    item.innerHTML = `
      ${producto.nombre} x ${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}
      <button class="btn-disminuir" data-id="${producto.id}">-</button>
      <button class="btn-aumentar" data-id="${producto.id}">+</button>
      <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
    `;
    itemsCarrito.appendChild(item);
    total += producto.precio * producto.cantidad;
  });

  totalCarrito.textContent = `Bs. ${total.toFixed(2)}`;
  contadorCarrito.textContent = totalProductos; // Actualizar contador de productos
  agregarEventosEliminar();
  agregarEventosCantidad();
}


// Función para agregar eventos a los botones de eliminar
function agregarEventosEliminar() {
  const botonesEliminar = document.querySelectorAll('.btn-eliminar');

  botonesEliminar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const idProducto = e.target.getAttribute('data-id');
      eliminarDelCarrito(idProducto); // Eliminar producto
    });
  });
}

// Función para manejar el cambio de cantidad
function agregarEventosCantidad() {
  const botonesAumentar = document.querySelectorAll('.btn-aumentar');
  const botonesDisminuir = document.querySelectorAll('.btn-disminuir');

  botonesAumentar.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const idProducto = e.target.getAttribute('data-id');
      cambiarCantidadProducto(idProducto, 1); // Aumentar cantidad
    });
  });

  botonesDisminuir.forEach(boton => {
    boton.addEventListener('click', (e) => {
      const idProducto = e.target.getAttribute('data-id');
      cambiarCantidadProducto(idProducto, -1); // Disminuir cantidad
    });
  });
}

// Función para cambiar la cantidad de un producto
function cambiarCantidadProducto(idProducto, cambio) {
  const producto = carrito.find(item => item.id === idProducto);

  if (producto) {
    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
      eliminarDelCarrito(idProducto); // Eliminar si la cantidad es 0
    } else {
      actualizarCarrito(); // Actualizar carrito
    }
  }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(idProducto) {
  carrito = carrito.filter(item => item.id !== idProducto); // Filtrar productos
  actualizarCarrito(); // Actualizar carrito
}

const modalFormulario = document.getElementById('modal-formulario');
const cerrarModal = document.getElementById('cerrar-modal');
const formEnvio = document.getElementById('form-envio');

// Asegúrate de que el modal esté oculto al cargar la página
window.addEventListener('load', () => {
  modalFormulario.style.display = 'none'; // Modal esté oculto
});

// Abrir el modal al finalizar la compra
btnFinalizarCompra.addEventListener('click', () => {
  if (carrito.length > 0) {
    modalFormulario.style.display = 'flex'; // Mostrar modal
  } else {
    alert('El carrito está vacío.');
  }
});

// Cerrar el modal al hacer clic en la "X"
cerrarModal.addEventListener('click', () => {
  modalFormulario.style.display = 'none'; // Ocultar modal
});

document.addEventListener('DOMContentLoaded', () => {
  const formEnvio = document.getElementById('form-envio');
  const modalFormulario = document.getElementById('modal-formulario');
  const cerrarModal = document.getElementById('cerrar-modal');
  // Evento para enviar el formulario
  formEnvio.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevenir recarga de la página

    const datosCliente = {
      nombre: document.getElementById('nombre').value,
      direccion: document.getElementById('direccion').value,
      telefono: document.getElementById('telefono').value,
      correo: document.getElementById('correo').value
    };

    console.log('Datos del Cliente:', datosCliente);

    // Mostrar una alerta simple
    alert('¡Gracias por su compra! Su pedido está en camino.');

    // Vaciar el carrito y actualizar la interfaz
    carrito = [];
    actualizarCarrito();

    // Cerrar el modal
    modalFormulario.style.display = 'none';
  });

  // Evento para cerrar el modal sin enviar el formulario
  cerrarModal.addEventListener('click', () => {
    modalFormulario.style.display = 'none';
  });
});



function toggleMenu() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.querySelector(".hamburger");
  
  navbar.classList.toggle("show");
  hamburger.classList.toggle("active");
}
