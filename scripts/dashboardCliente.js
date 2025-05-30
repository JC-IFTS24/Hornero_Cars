document.addEventListener('DOMContentLoaded', function () {
    console.log("SCRIPT: dashboardCliente.js cargado y DOMContentLoaded.");

    // --- USUARIO SIMULADO ---
    let currentUser = {
        userId: "simUser123", nombreCompleto: "Elena Rodriguez", email: "elena.rodriguez.dev@example.com",
        password: "passwordDev123", telefono: "+5491167890123", fechaNacimiento: "1992-11-08",
        documentacion: {
            dni: { numero: "32876543", fotoFrenteSim: "elena_dni.png" },
            licencia: { numero: "ARGFEDCBA1", categoria: "B1", fechaVencimiento: "2026-10-20", fotoSim: "elena_licencia.png" }
        },
        fechaRegistro: "2024-03-15T14:00:00Z"
    };

    function asegurarUsuarioSimuladoEnLocalStorage() {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const existeSimulado = usuarios.some(u => u.email === currentUser.email || u.userId === currentUser.userId);
        if (!existeSimulado) {
            console.log("SCRIPT: Añadiendo/actualizando usuario simulado a localStorage['usuarios'] para pruebas.");
            const indexSimulado = usuarios.findIndex(u => u.email === currentUser.email || u.userId === currentUser.userId);
            if (indexSimulado !== -1) { usuarios[indexSimulado] = currentUser; } else { usuarios.push(currentUser); }
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
    }
    asegurarUsuarioSimuladoEnLocalStorage();

    // --- Elementos del DOM Generales ---
    const sectionTitleElement = document.getElementById('dashboard-section-title');
    const saludoUsuarioEl = document.getElementById('saludoUsuario');

    // --- Elementos DOM "Mi Cuenta" ---
    const formMiCuenta = document.getElementById('formMiCuenta');
    const fieldsetMiCuenta = document.getElementById('fieldsetMiCuenta');
    const btnEditarCuenta = document.getElementById('btnEditarCuenta');
    const btnGuardarCambios = document.getElementById('btnGuardarCambios');
    const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');
    const miCuentaTituloSub = document.getElementById('miCuentaTituloSub');
    const cuentaNombreCompleto = document.getElementById('cuentaNombreCompleto');
    const cuentaEmail = document.getElementById('cuentaEmail');
    const cuentaTelefono = document.getElementById('cuentaTelefono');
    const cuentaFechaNacimiento = document.getElementById('cuentaFechaNacimiento');
    const cuentaFechaRegistro = document.getElementById('cuentaFechaRegistro');
    const cuentaDniNumero = document.getElementById('cuentaDniNumero');
    const cuentaDniFotoSim = document.getElementById('cuentaDniFotoSim');
    const cuentaLicenciaNumero = document.getElementById('cuentaLicenciaNumero');
    const cuentaLicenciaCategoria = document.getElementById('cuentaLicenciaCategoria');
    const cuentaLicenciaVencimiento = document.getElementById('cuentaLicenciaVencimiento');
    const cuentaLicenciaFotoSim = document.getElementById('cuentaLicenciaFotoSim');

    // --- Elementos DOM "Hacer Reserva" (Catálogo y Configuración) ---
    const vistaCatalogoGlobal = document.getElementById('vista-catalogo-vehiculos'); // Contenedor general del catálogo
    const dashboardContenedorVehiculos = document.getElementById("dashboard-contenedor-vehiculos");
    const dashboardFiltroCategoria = document.getElementById("dashboard-filtro-categoria");
    const dashboardFiltroMarca = document.getElementById("dashboard-filtro-marca");
    const dashboardBotonMostrarTodos = document.getElementById("dashboard-mostrar-todos-vehiculos");
    const dashboardMensajeNoVehiculos = document.getElementById("dashboard-mensaje-no-vehiculos");
    const seccionConfiguracionReserva = document.getElementById('dashboard-configuracion-reserva');
    const vehiculoSeleccionadoInfoImg = document.querySelector('#vehiculo-seleccionado-info img');
    const vehiculoSeleccionadoNombre = document.getElementById('vehiculo-seleccionado-nombre');
    const vehiculoSeleccionadoGrupo = document.getElementById('vehiculo-seleccionado-grupo');
    const vehiculoSeleccionadoPrecio = document.getElementById('vehiculo-seleccionado-precio');
    const fechaInicioReservaInput = document.getElementById('fechaInicioReserva');
    const fechaFinReservaInput = document.getElementById('fechaFinReserva');
    const checkSeguroBasico = document.getElementById('checkSeguroBasico');
    const checkSeguroCompleto = document.getElementById('checkSeguroCompleto');
    const cotizacionDias = document.getElementById('cotizacion-dias');
    const cotizacionCostoVehiculo = document.getElementById('cotizacion-costo-vehiculo');
    const cotizacionCostoSeguro = document.getElementById('cotizacion-costo-seguro');
    const cotizacionTotal = document.getElementById('cotizacion-total');
    const btnVolverAlCatalogo = document.getElementById('btnVolverAlCatalogo');
    const btnConfirmarReserva = document.getElementById('btnConfirmarReserva');

    let dashboardTodosLosVehiculos = [];
    let vehiculoParaCotizar = null;

    // --- Lógica Cerrar Sesión ---
    if (btnCerrarSesion) { 
        btnCerrarSesion.addEventListener('click', function() {
            alert('Has cerrado sesión (simulación). Redirigiendo al inicio...');
            window.location.href = '../index.html'; 
        });
    }

    // --- Funciones "Mi Cuenta" ---
    // (Las funciones poblarFormularioMiCuenta, toggleEditMode y los listeners de Mi Cuenta van aquí, sin cambios respecto a la última versión completa que te funcionaba)
    function poblarFormularioMiCuenta(usuario) {
        if (!usuario) { console.error("SCRIPT ERROR: No hay datos de usuario para poblar el formulario Mi Cuenta."); return; }
        if(cuentaNombreCompleto) cuentaNombreCompleto.value = usuario.nombreCompleto || '';
        if(cuentaEmail) cuentaEmail.value = usuario.email || '';
        if(cuentaTelefono) cuentaTelefono.value = usuario.telefono || '';
        if(cuentaFechaNacimiento) cuentaFechaNacimiento.value = usuario.fechaNacimiento || '';
        if(cuentaFechaRegistro) cuentaFechaRegistro.value = usuario.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' hs.' : '';
        if (usuario.documentacion) {
            if(cuentaDniNumero) cuentaDniNumero.value = usuario.documentacion.dni?.numero || '';
            if(cuentaDniFotoSim) cuentaDniFotoSim.value = usuario.documentacion.dni?.fotoFrenteSim || '';
            if(cuentaLicenciaNumero) cuentaLicenciaNumero.value = usuario.documentacion.licencia?.numero || '';
            if(cuentaLicenciaCategoria) cuentaLicenciaCategoria.value = usuario.documentacion.licencia?.categoria || '';
            if(cuentaLicenciaVencimiento) cuentaLicenciaVencimiento.value = usuario.documentacion.licencia?.fechaVencimiento || '';
            if(cuentaLicenciaFotoSim) cuentaLicenciaFotoSim.value = usuario.documentacion.licencia?.fotoSim || '';
        } else {
            if(cuentaDniNumero) cuentaDniNumero.value = ''; if(cuentaDniFotoSim) cuentaDniFotoSim.value = ''; 
            if(cuentaLicenciaNumero) cuentaLicenciaNumero.value = ''; if(cuentaLicenciaCategoria) cuentaLicenciaCategoria.value = ''; 
            if(cuentaLicenciaVencimiento) cuentaLicenciaVencimiento.value = ''; if(cuentaLicenciaFotoSim) cuentaLicenciaFotoSim.value = '';
        }
    }
    function toggleEditMode(edit) {
        if (fieldsetMiCuenta) fieldsetMiCuenta.disabled = !edit;
        if(miCuentaTituloSub) miCuentaTituloSub.textContent = edit ? "Editando Información de la Cuenta" : "Detalles de tu Cuenta";
        if (btnEditarCuenta && btnGuardarCambios && btnCancelarEdicion) {
            if (edit) {
                btnEditarCuenta.classList.add('d-none'); btnGuardarCambios.classList.remove('d-none'); btnCancelarEdicion.classList.remove('d-none');
            } else {
                btnEditarCuenta.classList.remove('d-none'); btnGuardarCambios.classList.add('d-none'); btnCancelarEdicion.classList.add('d-none');
            }
        }
    }
    if (btnEditarCuenta) { btnEditarCuenta.addEventListener('click', () => toggleEditMode(true)); }
    if (btnCancelarEdicion) { btnCancelarEdicion.addEventListener('click', () => { poblarFormularioMiCuenta(currentUser); toggleEditMode(false); }); }
    if (formMiCuenta) {
        formMiCuenta.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const datosActualizados = {
                userId: currentUser.userId, email: currentUser.email, password: currentUser.password, fechaRegistro: currentUser.fechaRegistro,
                nombreCompleto: cuentaNombreCompleto.value.trim(), telefono: cuentaTelefono.value.trim(), fechaNacimiento: cuentaFechaNacimiento.value,
                documentacion: {
                    dni: { numero: cuentaDniNumero.value.trim(), fotoFrenteSim: cuentaDniFotoSim.value.trim() },
                    licencia: { numero: cuentaLicenciaNumero.value.trim(), categoria: cuentaLicenciaCategoria.value.trim(), fechaVencimiento: cuentaLicenciaVencimiento.value, fotoSim: cuentaLicenciaFotoSim.value.trim() }
                }
            };
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const userIndex = usuarios.findIndex(u => u.userId === currentUser.userId || u.email === currentUser.email); 
            if (userIndex !== -1) {
                usuarios[userIndex].nombreCompleto = datosActualizados.nombreCompleto;
                usuarios[userIndex].telefono = datosActualizados.telefono;
                usuarios[userIndex].fechaNacimiento = datosActualizados.fechaNacimiento;
                usuarios[userIndex].documentacion = datosActualizados.documentacion;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
                currentUser = {...currentUser, ...usuarios[userIndex]}; 
                alert('¡Información actualizada con éxito en localStorage!');
            } else {
                currentUser = datosActualizados; 
                alert('Usuario simulado actualizado en memoria (no se encontró en la lista "usuarios" de localStorage).');
                console.warn("Asegúrate que el 'userId' o 'email' del 'currentUser' simulado coincida con un usuario registrado para persistencia.");
            }
            toggleEditMode(false); poblarFormularioMiCuenta(currentUser); 
        });
    }

    // --- Funciones "Hacer Reserva" ---
    function getHoyFormatoYYYYMMDD() {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia = String(hoy.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    }
    async function cargarVehiculosParaDashboard() {
        console.log("SCRIPT: Iniciando carga de vehículos para dashboard...");
        try {
            const res = await fetch("../data/vehiculos.json"); 
            if (!res.ok) { throw new Error(`Error HTTP: ${res.status} al cargar vehiculos.json`); }
            const data = await res.json();
            dashboardTodosLosVehiculos = data.vehiculos;
            console.log("SCRIPT: Vehículos cargados:", dashboardTodosLosVehiculos.length);
            mostrarVehiculosEnDashboard(dashboardTodosLosVehiculos);
            poblarFiltroMarcasDashboard(dashboardTodosLosVehiculos);
        } catch (error) {
            console.error("SCRIPT ERROR: Error al cargar los vehículos para el dashboard:", error);
            if (dashboardContenedorVehiculos) {
                dashboardContenedorVehiculos.innerHTML = '<p class="text-danger text-center col-12">Error al cargar los vehículos. Revisa la consola.</p>';
            }
        }
    }
    function mostrarVehiculosEnDashboard(vehiculos) {
        if (!dashboardContenedorVehiculos || !dashboardMensajeNoVehiculos) {
            console.error("SCRIPT ERROR: Contenedores de vehículos no encontrados en el DOM.");
            return;
        }
        dashboardContenedorVehiculos.innerHTML = ""; 
        if (vehiculos.length === 0) {
            if(dashboardMensajeNoVehiculos) dashboardMensajeNoVehiculos.style.display = 'block';
            return;
        }
        if(dashboardMensajeNoVehiculos) dashboardMensajeNoVehiculos.style.display = 'none';
        
        vehiculos.forEach(auto => {
            const card = document.createElement("div");
            card.classList.add("col"); 
            card.innerHTML = `
                <div class="card h-100 shadow-sm vehicle-card-dashboard">
                    <img src="${auto.imagen}" class="card-img-top" alt="${auto.marca} ${auto.modelo}" style="height: 180px; object-fit: cover;">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${auto.marca} ${auto.modelo}</h5>
                        <p class="card-text small text-muted mb-1">Grupo: ${auto.grupo}</p>
                        <p class="card-text small mb-1">Puertas: ${auto.puertas} | Plazas: ${auto.plazas}</p>
                        <p class="card-text small mb-2">Maletero: ${auto.maletero}</p>
                        <h6 class="text-primary mt-auto pt-2"><strong>$${auto.precio_dia.toLocaleString('es-AR')}</strong> /día</h6>
                        <button class="btn btn-primary w-100 mt-2 btn-reservar-vehiculo-dashboard" data-vehicle-id="${auto.id}">
                            <i class="bi bi-calendar-check me-2"></i>Seleccionar y Cotizar
                        </button>
                    </div>
                </div>`;
            dashboardContenedorVehiculos.appendChild(card);
        });
        console.log(`SCRIPT: ${vehiculos.length} tarjetas de vehículos renderizadas. Listeners en contenedor padre.`);
    }
    function poblarFiltroMarcasDashboard(vehiculos) {
        if (!dashboardFiltroMarca) return;
        while (dashboardFiltroMarca.options.length > 1) { dashboardFiltroMarca.remove(1); }
        const marcas = [...new Set(vehiculos.map(auto => auto.marca))].sort();
        marcas.forEach(marca => {
            const option = document.createElement("option");
            option.value = marca.toLowerCase(); option.textContent = marca;
            dashboardFiltroMarca.appendChild(option);
        });
    }
    function filtrarVehiculosDashboard() {
        if (!dashboardFiltroCategoria || !dashboardFiltroMarca || !dashboardTodosLosVehiculos) return;
        const categoriaSeleccionada = dashboardFiltroCategoria.value;
        const marcaSeleccionada = dashboardFiltroMarca.value;
        const vehiculosFiltrados = dashboardTodosLosVehiculos.filter(auto => {
            const catOk = categoriaSeleccionada === "" || auto.categoria.toLowerCase() === categoriaSeleccionada;
            const marcaOk = marcaSeleccionada === "" || auto.marca.toLowerCase() === marcaSeleccionada;
            return catOk && marcaOk;
        });
        mostrarVehiculosEnDashboard(vehiculosFiltrados);
    }
    if (dashboardFiltroCategoria) dashboardFiltroCategoria.addEventListener("change", filtrarVehiculosDashboard);
    if (dashboardFiltroMarca) dashboardFiltroMarca.addEventListener("change", filtrarVehiculosDashboard);
    if (dashboardBotonMostrarTodos) {
        dashboardBotonMostrarTodos.addEventListener("click", () => {
            if (dashboardFiltroCategoria) dashboardFiltroCategoria.value = "";
            if (dashboardFiltroMarca) dashboardFiltroMarca.value = "";
            mostrarVehiculosEnDashboard(dashboardTodosLosVehiculos);
        });
    }

    function mostrarVistaConfiguracionReserva(mostrar) {
        console.log("SCRIPT: Entrando a mostrarVistaConfiguracionReserva, mostrar:", mostrar);
        // const vistaCatalogoFiltros = document.getElementById('dashboard-filtros-vehiculos'); // Ya definido globalmente como seccionVistaCatalogo
        // const vistaCatalogoContenedor = document.getElementById('dashboard-contenedor-vehiculos'); // Ya definido globalmente como seccionVistaContenedorVehiculos
        // const seccionConfigReserva = document.getElementById('dashboard-configuracion-reserva'); // Ya definido globalmente como seccionConfiguracionReserva

        if (!vistaCatalogoGlobal || !seccionConfiguracionReserva) { // vistaCatalogoGlobal agrupa filtros y contenedor de vehículos
            console.error("SCRIPT ERROR: Elemento #vista-catalogo-vehiculos o #dashboard-configuracion-reserva no encontrado.");
            return;
        }

        if (mostrar) {
            console.log("SCRIPT: Ocultando catálogo (#vista-catalogo-vehiculos) y mostrando configuración de reserva.");
            vistaCatalogoGlobal.classList.add('d-none');
            seccionConfiguracionReserva.classList.remove('d-none');
            
            // Scroll hacia la sección de configuración
            if (seccionConfiguracionReserva.scrollIntoView) {
                console.log("SCRIPT: Haciendo scroll a la vista de configuración.");
                seccionConfiguracionReserva.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else { 
            console.log("SCRIPT: Mostrando catálogo (#vista-catalogo-vehiculos) y ocultando configuración de reserva.");
            vistaCatalogoGlobal.classList.remove('d-none');
            seccionConfiguracionReserva.classList.add('d-none');
        }
    }

    function actualizarCotizacion() {
        if (!vehiculoParaCotizar || !fechaInicioReservaInput || !fechaFinReservaInput || !cotizacionDias || !cotizacionCostoVehiculo || !cotizacionCostoSeguro || !cotizacionTotal) {
             console.warn("SCRIPT WARN: Elementos de cotización no encontrados en el DOM o datos faltantes."); return;
        }
        if (!fechaInicioReservaInput.value || !fechaFinReservaInput.value) {
            cotizacionDias.textContent = '0'; cotizacionCostoVehiculo.textContent = '0';
            cotizacionCostoSeguro.textContent = '0'; cotizacionTotal.textContent = '0';
            return;
        }
        const fechaInicio = new Date(fechaInicioReservaInput.value + "T00:00:00Z");
        const fechaFin = new Date(fechaFinReservaInput.value + "T00:00:00Z");
        if (fechaFin <= fechaInicio) {
            cotizacionDias.textContent = '0'; cotizacionCostoVehiculo.textContent = '0';
            cotizacionCostoSeguro.textContent = '0'; cotizacionTotal.textContent = '0';
            // No alertar aquí para no interrumpir la selección de fechas. Se valida al confirmar.
            return;
        }
        const diffTiempo = fechaFin.getTime() - fechaInicio.getTime();
        const diffDias = Math.max(1, Math.ceil(diffTiempo / (1000 * 3600 * 24))); 
        
        const costoVehiculoPorDia = vehiculoParaCotizar.precio_dia;
        const costoTotalVehiculo = costoVehiculoPorDia * diffDias;
        let costoSeguroTotal = 0;
        // Usar el valor del checkbox que es el precio diario del seguro
        if (checkSeguroBasico && checkSeguroBasico.checked) costoSeguroTotal += parseFloat(checkSeguroBasico.value) * diffDias;
        if (checkSeguroCompleto && checkSeguroCompleto.checked) costoSeguroTotal += parseFloat(checkSeguroCompleto.value) * diffDias;
        const totalFinal = costoTotalVehiculo + costoSeguroTotal;
        cotizacionDias.textContent = diffDias;
        cotizacionCostoVehiculo.textContent = costoTotalVehiculo.toLocaleString('es-AR');
        cotizacionCostoSeguro.textContent = costoSeguroTotal.toLocaleString('es-AR');
        cotizacionTotal.textContent = totalFinal.toLocaleString('es-AR');
    }

    function handleSeleccionarVehiculoParaCotizar(event) {
        console.log("SCRIPT: handleSeleccionarVehiculoParaCotizar FUE LLAMADA. Elemento clickeado:", event.target);
        const boton = event.target.closest('.btn-reservar-vehiculo-dashboard');
        if (!boton) {
            console.log("SCRIPT: Clic no fue en un botón de cotizar o su interior.");
            return;
        }
        const vehicleId = boton.dataset.vehicleId;
        console.log("SCRIPT: Vehículo ID para cotizar:", vehicleId);
        if (!vehicleId) {
            console.error("SCRIPT ERROR: No se encontró data-vehicle-id en el botón:", boton);
            return;
        }
        vehiculoParaCotizar = dashboardTodosLosVehiculos.find(v => String(v.id) === String(vehicleId)); 
        if (vehiculoParaCotizar) {
            if (vehiculoSeleccionadoInfoImg) vehiculoSeleccionadoInfoImg.src = vehiculoParaCotizar.imagen;
            if (vehiculoSeleccionadoNombre) vehiculoSeleccionadoNombre.textContent = `${vehiculoParaCotizar.marca} ${vehiculoParaCotizar.modelo}`;
            if (vehiculoSeleccionadoGrupo) vehiculoSeleccionadoGrupo.textContent = `Grupo: ${vehiculoParaCotizar.grupo}`;
            if (vehiculoSeleccionadoPrecio) vehiculoSeleccionadoPrecio.textContent = `Precio/día: $${vehiculoParaCotizar.precio_dia.toLocaleString('es-AR')}`;
            const hoy = getHoyFormatoYYYYMMDD();
            if(fechaInicioReservaInput) { fechaInicioReservaInput.min = hoy; fechaInicioReservaInput.value = hoy; }
            if(fechaFinReservaInput) { fechaFinReservaInput.min = hoy; fechaFinReservaInput.value = ''; }
            if(checkSeguroBasico) checkSeguroBasico.checked = false; 
            if(checkSeguroCompleto) checkSeguroCompleto.checked = false;
            actualizarCotizacion(); 
            console.log("SCRIPT: Mostrando vista de configuración de reserva.");
            mostrarVistaConfiguracionReserva(true);
        } else {
            console.error("SCRIPT ERROR: No se encontró el vehículo seleccionado con ID:", vehicleId, "en la lista:", dashboardTodosLosVehiculos);
        }
    }

    // --- EVENT LISTENER DELEGADO PARA BOTONES "SELECCIONAR Y COTIZAR" ---
    if (dashboardContenedorVehiculos) {
        dashboardContenedorVehiculos.addEventListener('click', function(event) {
            const botonPresionado = event.target.closest('.btn-reservar-vehiculo-dashboard');
            if (botonPresionado) {
                handleSeleccionarVehiculoParaCotizar(event); 
            }
        });
        console.log("SCRIPT: Listener de CLIC delegado añadido a dashboardContenedorVehiculos.");
    } else {
        console.error("SCRIPT ERROR: dashboardContenedorVehiculos no encontrado para añadir listener delegado.");
    }

    // --- Listeners para la vista de Configuración de Reserva ---
    if (btnVolverAlCatalogo) { btnVolverAlCatalogo.addEventListener('click', () => { console.log("SCRIPT: Clic en Volver al Catálogo."); mostrarVistaConfiguracionReserva(false); vehiculoParaCotizar = null; }); }
    if (fechaInicioReservaInput) { fechaInicioReservaInput.addEventListener('change', () => { if(fechaFinReservaInput) fechaFinReservaInput.min = fechaInicioReservaInput.value; if (fechaFinReservaInput && fechaFinReservaInput.value && fechaFinReservaInput.value < fechaInicioReservaInput.value) { fechaFinReservaInput.value = fechaInicioReservaInput.value; } actualizarCotizacion(); }); }
    if (fechaFinReservaInput) fechaFinReservaInput.addEventListener('change', actualizarCotizacion);
    if (checkSeguroBasico) checkSeguroBasico.addEventListener('change', actualizarCotizacion);
    if (checkSeguroCompleto) checkSeguroCompleto.addEventListener('change', actualizarCotizacion);

    if (btnConfirmarReserva) {
        btnConfirmarReserva.addEventListener('click', function() {
            console.log("SCRIPT: Clic en Confirmar Reserva.");
            if (!currentUser || !vehiculoParaCotizar || !fechaInicioReservaInput.value || !fechaFinReservaInput.value) {
                alert("Por favor, completa todos los datos necesarios para la reserva (fechas y selección de vehículo)."); return;
            }
            const fechaInicio = new Date(fechaInicioReservaInput.value + "T00:00:00Z");
            const fechaFin = new Date(fechaFinReservaInput.value + "T00:00:00Z");
            if (fechaFin <= fechaInicio) { alert("La fecha de fin debe ser posterior a la fecha de inicio."); return; }
            const hoy = new Date(getHoyFormatoYYYYMMDD() + "T00:00:00Z");
            if (fechaInicio < hoy) { alert("La fecha de inicio no puede ser anterior al día de hoy."); return; }

            const reservaId = 'RES-' + Date.now();
            let segurosSeleccionados = [];
            if (checkSeguroBasico.checked) segurosSeleccionados.push({nombre: "Básico", costo: parseFloat(checkSeguroBasico.value)});
            if (checkSeguroCompleto.checked) segurosSeleccionados.push({nombre: "Completo", costo: parseFloat(checkSeguroCompleto.value)});
            const nuevaReserva = {
                reservaId: reservaId, userId: currentUser.userId, userNombre: currentUser.nombreCompleto,
                vehiculoId: vehiculoParaCotizar.id, vehiculoNombre: `${vehiculoParaCotizar.marca} ${vehiculoParaCotizar.modelo}`,
                fechaInicio: fechaInicioReservaInput.value, fechaFin: fechaFinReservaInput.value,
                dias: parseInt(cotizacionDias.textContent) || 0,
                costoVehiculo: parseFloat(cotizacionCostoVehiculo.textContent.replace(/\./g, '').replace(',', '.')) || 0,
                costoSeguro: parseFloat(cotizacionCostoSeguro.textContent.replace(/\./g, '').replace(',', '.')) || 0,
                costoTotal: parseFloat(cotizacionTotal.textContent.replace(/\./g, '').replace(',', '.')) || 0,
                seguros: segurosSeleccionados, estado: "Confirmada - Pendiente de Pago", fechaCreacion: new Date().toISOString()
            };
            console.log("SCRIPT: Nueva reserva a guardar:", nuevaReserva);
            let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
            reservas.push(nuevaReserva);
            localStorage.setItem('reservas', JSON.stringify(reservas));
            alert(`¡Reserva realizada con éxito!\nTu número de reserva es: ${reservaId}\nPuedes ver tus reservas en la sección "Mis Reservas".`);
            mostrarVistaConfiguracionReserva(false); 
            vehiculoParaCotizar = null; 
            if(fechaFinReservaInput) fechaFinReservaInput.value = '';
            if(checkSeguroBasico) checkSeguroBasico.checked = false;
            if(checkSeguroCompleto) checkSeguroCompleto.checked = false;
            actualizarCotizacion(); 
        });
    }

    // --- Funciones Inicializar Secciones ---
    function inicializarSeccionInicioDashboard() { if (saludoUsuarioEl && currentUser) { saludoUsuarioEl.textContent = `¡Hola, ${currentUser.nombreCompleto.split(' ')[0]}!`; } }
    function inicializarSeccionMiCuenta() { if (currentUser) { poblarFormularioMiCuenta(currentUser); } else { console.error("SCRIPT ERROR: No hay datos de currentUser para mostrar en Mi Cuenta."); const miCuentaContent = document.getElementById('mi-cuenta-content'); if (miCuentaContent) { miCuentaContent.innerHTML = "<p class='text-danger'>Error al cargar datos del usuario.</p>"; }} toggleEditMode(false); }
    
    // --- Lógica Pestañas (inicio y cambio) ---
    const navPillsLinks = document.querySelectorAll('.dashboard-nav-pills .nav-link');
    const initialActiveTab = document.querySelector('.dashboard-nav-pills .nav-link.active');
    function actualizarTituloPrincipal(activeTabElement) { if (sectionTitleElement && activeTabElement && activeTabElement.textContent) { sectionTitleElement.textContent = activeTabElement.textContent.trim(); }}
    function manejarCambioDePestana(targetId) {
        console.log("SCRIPT: Cambiando a pestaña con targetId:", targetId);
        let mantenerConfiguracionVisible = (targetId === '#hacer-reserva-content' && vehiculoParaCotizar !== null && seccionConfiguracionReserva && !seccionConfiguracionReserva.classList.contains('d-none'));

        if (!mantenerConfiguracionVisible && seccionConfiguracionReserva && !seccionConfiguracionReserva.classList.contains('d-none')) {
            mostrarVistaConfiguracionReserva(false);
        }

        if (targetId === '#inicio-dashboard-content') {
            inicializarSeccionInicioDashboard(); 
        } else if (targetId === '#mi-cuenta-content') {
            inicializarSeccionMiCuenta(); 
        } else if (targetId === '#hacer-reserva-content') {
            if (dashboardTodosLosVehiculos.length === 0) { 
                console.log("SCRIPT: Pestaña 'Hacer Reserva' activada, cargando vehículos.");
                cargarVehiculosParaDashboard(); 
            } else if (!vehiculoParaCotizar) {
                 console.log("SCRIPT: Pestaña 'Hacer Reserva' activada, mostrando catálogo (vehículos ya cargados).");
                 mostrarVistaConfiguracionReserva(false);
            }
        } else if (targetId === '#mis-reservas-content') {
            console.log("SCRIPT: Cargando/Inicializando sección Mis Reservas..."); 
        }
    }
    if (initialActiveTab) { actualizarTituloPrincipal(initialActiveTab); const initialTargetId = initialActiveTab.getAttribute('data-bs-target'); manejarCambioDePestana(initialTargetId); }
    navPillsLinks.forEach((tabEl) => { tabEl.addEventListener('shown.bs.tab', event => { const newActiveTab = event.target; const targetId = newActiveTab.getAttribute('data-bs-target'); actualizarTituloPrincipal(newActiveTab); manejarCambioDePestana(targetId); }); });

}); 