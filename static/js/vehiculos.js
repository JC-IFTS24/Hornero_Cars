// scripts/vehiculos.js

// Espera a que el DOM (Document Object Model) esté completamente cargado antes de ejecutar el script.
document.addEventListener("DOMContentLoaded", () => {
  // Obtiene referencias a los elementos HTML donde se mostrarán y filtrarán los vehículos.
  const contenedorVehiculos = document.getElementById("contenedor-vehiculos");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const filtroMarca = document.getElementById("filtro-marca");
  const botonMostrarTodos = document.getElementById("mostrar-todos"); // Referencia al nuevo botón "Mostrar Todos"

  let todosLosVehiculos = []; // Variable para almacenar todos los vehículos cargados desde el JSON.

  // Realiza una petición (fetch) para obtener los datos de los vehículos desde el archivo JSON.
  fetch("../data/vehiculos.json") // Ruta al archivo JSON de vehículos.
    .then(res => {
      // Verifica si la respuesta de la red es exitosa.
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status}`); // Lanza un error si la respuesta no es OK.
      }
      return res.json(); // Parsea la respuesta como JSON.
    })
    .then(data => {
      // Una vez que los datos JSON son recibidos y parseados:
      todosLosVehiculos = data.vehiculos; // Asigna los vehículos a la variable global.
      mostrarVehiculos(todosLosVehiculos); // Muestra todos los vehículos inicialmente.
      poblarFiltroMarcas(todosLosVehiculos); // Rellena el select de marcas.
    })
    .catch(error => {
      // Captura y maneja cualquier error que ocurra durante la petición o el parseo.
      console.error("Error al cargar los vehículos:", error);
      contenedorVehiculos.innerHTML = '<p class="text-danger text-center">Error al cargar los vehículos. Inténtalo de nuevo más tarde.</p>';
    });

  // Agrega Event Listeners a los filtros para que se actualicen al cambiar la selección.
  filtroCategoria.addEventListener("change", () => {
    filtrarVehiculos(); // Llama a la función de filtrado.
  });

  filtroMarca.addEventListener("change", () => {
    filtrarVehiculos(); // Llama a la función de filtrado.
  });

  // Agrega Event Listener al nuevo botón "Mostrar Todos"
  botonMostrarTodos.addEventListener("click", () => {
    // Restablece los selectores de filtro a sus valores predeterminados (vacíos).
    filtroCategoria.value = "";
    filtroMarca.value = "";
    mostrarVehiculos(todosLosVehiculos); // Muestra todos los vehículos sin filtrar.
  });

  /**
   * Muestra los vehículos en el contenedor HTML.
   * @param {Array} vehiculos - Un array de objetos de vehículos a mostrar.
   */
  function mostrarVehiculos(vehiculos) {
    contenedorVehiculos.innerHTML = ""; // Limpia el contenido actual del contenedor.
    if (vehiculos.length === 0) {
      contenedorVehiculos.innerHTML = '<p class="col-12 text-center text-muted">No se encontraron vehículos con los filtros seleccionados.</p>';
      return;
    }
    // Itera sobre cada objeto de vehículo en el array.
    vehiculos.forEach(auto => {
      // Crea un nuevo elemento 'div' para la tarjeta del vehículo.
      const card = document.createElement("div");
      // Agrega clases de Bootstrap para el diseño de la cuadrícula y la tarjeta.
      card.classList.add("col", "mb-4"); // 'col' para columnas responsivas, 'mb-4' para margen inferior
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${auto.imagen}" class="card-img-top" alt="${auto.modelo}">
          <div class="card-body">
            <h5 class="card-title">${auto.marca} ${auto.modelo}</h5>
            <p class="card-text"><strong>Grupo:</strong> ${auto.grupo}</p>
            <p class="card-text"><strong>Puertas:</strong> ${auto.puertas} | <strong>Plazas:</strong> ${auto.plazas}</p>
            <p class="card-text"><strong>Maletero:</strong> ${auto.maletero}</p>
            <p class="card-text"><strong>Edad mínima:</strong> ${auto.edad_minima} años</p>
            <h4 class="text-primary mt-3"><strong>Precio/día:</strong> $${auto.precio_dia.toLocaleString()} ARS</h4>
            <button class="btn btn-primary btn-reserva w-100 mt-2" data-vehicle-id="${auto.id}">Reservar este auto</button>
          </div>
        </div>
      `;
      // Agrega la tarjeta al contenedor de vehículos.
      contenedorVehiculos.appendChild(card);
    });

    // Agrega event listeners a todos los botones de "Reservar" recién creados.
    document.querySelectorAll('.btn-reserva').forEach(button => {
      button.addEventListener('click', (event) => {
        // Obtiene el ID del vehículo del atributo data-vehicle-id.
        const vehicleId = event.target.dataset.vehicleId;
        // Llama a la función para manejar la reserva.
        manejarReserva(vehicleId);
      });
    });
  }

  /**
   * Rellena el selector de marcas con las marcas únicas de los vehículos.
   * @param {Array} vehiculos - El array completo de objetos de vehículos.
   */
  function poblarFiltroMarcas(vehiculos) {
    // Usa un Set para obtener solo marcas únicas y luego las convierte en un array.
    const marcas = [...new Set(vehiculos.map(auto => auto.marca))];
    // Ordena las marcas alfabéticamente.
    marcas.sort();
    // Itera sobre cada marca para crear una opción en el selector.
    marcas.forEach(marca => {
      const option = document.createElement("option");
      option.value = marca.toLowerCase(); // El valor de la opción en minúsculas para facilitar la comparación.
      option.textContent = marca; // El texto visible de la opción.
      filtroMarca.appendChild(option); // Agrega la opción al select de marcas.
    });
  }

  /**
   * Filtra los vehículos basándose en la categoría y la marca seleccionadas.
   */
  function filtrarVehiculos() {
    const categoriaSeleccionada = filtroCategoria.value; // Obtiene el valor seleccionado en el filtro de categoría.
    const marcaSeleccionada = filtroMarca.value; // Obtiene el valor seleccionado en el filtro de marca.

    // Filtra el array original de todos los vehículos.
    const vehiculosFiltrados = todosLosVehiculos.filter(auto => {
      // Comprueba si el auto coincide con la categoría seleccionada (si hay una).
      // Si categoriaSeleccionada es vacío, catOk es true (no filtra por categoría).
      const catOk = categoriaSeleccionada === "" || auto.categoria.toLowerCase() === categoriaSeleccionada;
      // Comprueba si el auto coincide con la marca seleccionada (si hay una).
      // Si marcaSeleccionada es vacío, marcaOk es true (no filtra por marca).
      const marcaOk = marcaSeleccionada === "" || auto.marca.toLowerCase() === marcaSeleccionada;
      // El auto se incluye en el resultado si cumple ambas condiciones.
      return catOk && marcaOk;
    });

    mostrarVehiculos(vehiculosFiltrados); // Muestra los vehículos que cumplen con los filtros.
  }

  /**
   * Función para manejar el clic en el botón "Reservar".
   * Aquí se implementará la lógica para verificar si el usuario está logueado
   * y redirigir al login o a la página de reserva con el vehículo pre-seleccionado.
   * @param {string} vehicleId - El ID del vehículo que se desea reservar.
   */
  function manejarReserva(vehicleId) {
    console.log(`Intentando reservar el vehículo con ID: ${vehicleId}`);

    // **Lógica Pendiente (Coordinar con Julián para el Login):**
    // 1. Verificar si el usuario está logueado.
    //    Esto probablemente implicará revisar algún valor en localStorage o sessionStorage,
    //    o hacer una llamada a una función de autenticación que Julián proporcione.
    const usuarioLogueado = localStorage.getItem('usuarioLogueado'); // Ejemplo: supongamos que Julián guarda esto.

    if (usuarioLogueado) {
      // Si el usuario está logueado, redirigir a la página de reserva
      // y pasar el ID del vehículo, por ejemplo, en la URL (parámetro de consulta)
      // o guardarlo temporalmente en localStorage.
      localStorage.setItem('vehiculoParaReserva', vehicleId); // Guardar el ID para que reserva.html lo use.
      window.location.href = 'reserva.html'; // Redirigir a la página de reserva
    } else {
      // Si el usuario NO está logueado, redirigir a la página de login.
      // Se podría guardar el ID del vehículo en localStorage para que,
      // después del login exitoso, el usuario sea redirigido a la reserva de ese auto.
      localStorage.setItem('redireccionPostLogin', 'reserva.html'); // Indica a dónde ir después del login
      localStorage.setItem('vehiculoParaReserva', vehicleId); // Guarda el vehículo deseado
      window.location.href = 'login.html'; // Suponiendo que la página de login se llama login.html
      alert('Para reservar, primero debes iniciar sesión.'); // Mensaje al usuario
    }
  }
});