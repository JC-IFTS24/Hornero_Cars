document.addEventListener('DOMContentLoaded', function () {
    // --- USUARIO SIMULADO (O CARGADO DESDE LOGIN REAL EN EL FUTURO) ---
    let currentUser = {
        userId: "simUser123",
        nombreCompleto: "Elena Rodriguez",
        email: "elena.rodriguez.dev@example.com",
        password: "passwordDev123",
        telefono: "+5491167890123",
        fechaNacimiento: "1992-11-08",
        documentacion: {
            dni: { numero: "32876543", fotoFrenteSim: "elena_dni.png" },
            licencia: { numero: "ARGFEDCBA1", categoria: "B1", fechaVencimiento: "2026-10-20", fotoSim: "elena_licencia.png" }
        },
        fechaRegistro: "2024-03-15T14:00:00Z"
    };

    // --- AJUSTE: ASEGURAR QUE EL USUARIO SIMULADO ESTÉ EN LOCALSTORAGE['usuarios'] PARA PRUEBAS ---
    // Esto es para que puedas probar la función de "Guardar Cambios" en "Mi Cuenta" inmediatamente.
    // En un sistema real, este usuario vendría del login o ya estaría registrado.
    function asegurarUsuarioSimuladoEnLocalStorage() {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const existeSimulado = usuarios.some(u => u.email === currentUser.email || u.userId === currentUser.userId);

        if (!existeSimulado) {
            console.log("Añadiendo/actualizando usuario simulado a localStorage['usuarios'] para pruebas.");
            // Si hay alguno con el mismo email/id, lo actualizamos, si no, lo añadimos.
            const indexSimulado = usuarios.findIndex(u => u.email === currentUser.email || u.userId === currentUser.userId);
            if (indexSimulado !== -1) {
                usuarios[indexSimulado] = currentUser;
            } else {
                usuarios.push(currentUser);
            }
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
    }
    asegurarUsuarioSimuladoEnLocalStorage(); // Ejecutamos esto al cargar la página del dashboard.


    // --- Elementos del DOM ---
    const formMiCuenta = document.getElementById('formMiCuenta');
    const fieldsetMiCuenta = document.getElementById('fieldsetMiCuenta');
    const btnEditarCuenta = document.getElementById('btnEditarCuenta');
    const btnGuardarCambios = document.getElementById('btnGuardarCambios');
    const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');
    const miCuentaTituloSub = document.getElementById('miCuentaTituloSub');

    // Inputs del formulario "Mi Cuenta"
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

    // --- Lógica del Botón Cerrar Sesión ---
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function() {
            // localStorage.removeItem('currentUser'); // Cuando el login real use esta clave
            alert('Has cerrado sesión (simulación). Redirigiendo al inicio...');
            window.location.href = '../index.html';
        });
    }

    // --- Manejo de Pestañas del Dashboard y Título Principal ---
    const navLinks = document.querySelectorAll('.dashboard-nav-pills .nav-link');
    const sectionTitleElement = document.getElementById('dashboard-section-title');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            if (sectionTitleElement && event.target.textContent) {
                sectionTitleElement.textContent = event.target.textContent.trim();
            }
        });
    });
    
    // --- Funciones para "Mi Cuenta" ---
    function poblarFormularioMiCuenta(usuario) {
        if (!usuario) {
            console.error("No hay datos de usuario para poblar el formulario.");
            return;
        }
        
        cuentaNombreCompleto.value = usuario.nombreCompleto || '';
        cuentaEmail.value = usuario.email || '';
        cuentaTelefono.value = usuario.telefono || '';
        cuentaFechaNacimiento.value = usuario.fechaNacimiento || '';
        cuentaFechaRegistro.value = usuario.fechaRegistro ? new Date(usuario.fechaRegistro).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' hs.' : '';

        if (usuario.documentacion) {
            cuentaDniNumero.value = usuario.documentacion.dni?.numero || '';
            cuentaDniFotoSim.value = usuario.documentacion.dni?.fotoFrenteSim || '';
            cuentaLicenciaNumero.value = usuario.documentacion.licencia?.numero || '';
            cuentaLicenciaCategoria.value = usuario.documentacion.licencia?.categoria || '';
            cuentaLicenciaVencimiento.value = usuario.documentacion.licencia?.fechaVencimiento || '';
            cuentaLicenciaFotoSim.value = usuario.documentacion.licencia?.fotoSim || '';
        } else {
            cuentaDniNumero.value = '';
            cuentaDniFotoSim.value = '';
            cuentaLicenciaNumero.value = '';
            cuentaLicenciaCategoria.value = '';
            cuentaLicenciaVencimiento.value = '';
            cuentaLicenciaFotoSim.value = '';
        }
    }

    function toggleEditMode(edit) {
        if (fieldsetMiCuenta) fieldsetMiCuenta.disabled = !edit;
        if(miCuentaTituloSub) miCuentaTituloSub.textContent = edit ? "Editando Información de la Cuenta" : "Detalles de tu Cuenta";

        if (edit) {
            btnEditarCuenta.classList.add('d-none');
            btnGuardarCambios.classList.remove('d-none');
            btnCancelarEdicion.classList.remove('d-none');
        } else {
            btnEditarCuenta.classList.remove('d-none');
            btnGuardarCambios.classList.add('d-none');
            btnCancelarEdicion.classList.add('d-none');
        }
    }

    if (btnEditarCuenta) {
        btnEditarCuenta.addEventListener('click', () => toggleEditMode(true));
    }

    if (btnCancelarEdicion) {
        btnCancelarEdicion.addEventListener('click', () => {
            poblarFormularioMiCuenta(currentUser); 
            toggleEditMode(false);
        });
    }

    if (formMiCuenta) {
        formMiCuenta.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            const datosActualizados = {
                userId: currentUser.userId,
                email: currentUser.email, 
                password: currentUser.password, 
                fechaRegistro: currentUser.fechaRegistro,
                nombreCompleto: cuentaNombreCompleto.value.trim(),
                telefono: cuentaTelefono.value.trim(),
                fechaNacimiento: cuentaFechaNacimiento.value,
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
                currentUser = {...currentUser, ...usuarios[userIndex]}; // Actualiza el currentUser en memoria con los datos guardados
                alert('¡Información actualizada con éxito en localStorage!');
            } else {
                // Esto no debería pasar ahora gracias a asegurarUsuarioSimuladoEnLocalStorage()
                // pero lo dejamos como un fallback por si acaso.
                currentUser = datosActualizados; 
                alert('Error: Usuario no encontrado en localStorage para actualizar, cambios solo en memoria.');
                console.error("Error crítico: El usuario simulado debería estar en localStorage en este punto.");
            }
            
            toggleEditMode(false);
            poblarFormularioMiCuenta(currentUser); 
        });
    }

    // --- Lógica para Cargar Contenido de Pestañas e Inicializar "Mi Cuenta" ---
    function inicializarSeccionMiCuenta() {
        if (currentUser) {
            poblarFormularioMiCuenta(currentUser);
        } else {
            // Esto es un fallback si currentUser no se definiera por alguna razón
            console.error("Error: No hay datos de currentUser para mostrar en Mi Cuenta.");
            const miCuentaContent = document.getElementById('mi-cuenta-content');
            if (miCuentaContent) {
                miCuentaContent.innerHTML = "<p class='text-danger'>Error al cargar datos del usuario.</p>";
            }
        }
        toggleEditMode(false); 
    }

    const initialActiveTabEl = document.querySelector('.dashboard-nav-pills .nav-link.active');
    if (initialActiveTabEl) {
        if (sectionTitleElement && initialActiveTabEl.textContent) {
             sectionTitleElement.textContent = initialActiveTabEl.textContent.trim();
        }
        if (initialActiveTabEl.getAttribute('data-bs-target') === '#mi-cuenta-content') {
            inicializarSeccionMiCuenta();
        }
    }
    
    document.querySelectorAll('a[data-bs-toggle="tab"]').forEach((tabEl) => {
        tabEl.addEventListener('shown.bs.tab', event => { 
            const targetId = event.target.getAttribute('data-bs-target');
            const newActiveTab = event.target;

            if (sectionTitleElement && newActiveTab.textContent) { 
                sectionTitleElement.textContent = newActiveTab.textContent.trim();
            }

            if (targetId === '#mi-cuenta-content') {
                inicializarSeccionMiCuenta();
            } else if (targetId === '#hacer-reserva-content') {
                console.log("Cargando sección Hacer Reserva...");
                // Aquí llamarás a la función para cargar/inicializar la sección "Hacer Reserva"
            } else if (targetId === '#mis-reservas-content') {
                console.log("Cargando sección Mis Reservas...");
                // Aquí llamarías a la función para cargar/inicializar la sección "Mis Reservas"
            }
        });
    });
});