// static/scripts/registro.js
document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistro');

    formRegistro.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value; // Nuevo campo
        const telefono = document.getElementById('telefono').value.trim();
        const fechaNacimiento = document.getElementById('fechaNacimiento').value;
        const dniNumero = document.getElementById('dniNumero').value.trim();
        const licenciaNumero = document.getElementById('licenciaNumero').value.trim();
        const licenciaCategoria = document.getElementById('licenciaCategoria').value.trim();
        const licenciaVencimiento = document.getElementById('licenciaVencimiento').value;

        // Validaciones
        if (!nombreCompleto || !email || !password || !confirmPassword) { // Añadir confirmPassword
            alert('Por favor, completa todos los campos obligatorios (*).');
            return;
        }

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        // (Aquí podrías añadir más validaciones: longitud de contraseña, formato de email, etc.)

        const nuevoUsuario = {
            userId: 'user' + Date.now() + Math.floor(Math.random() * 1000),
            nombreCompleto: nombreCompleto,
            email: email,
            password: password, // En un proyecto real, esto se hashearía en el backend
            telefono: telefono,
            fechaNacimiento: fechaNacimiento,
            documentacion: {
                dni: {
                    numero: dniNumero,
                    fotoFrenteSim: "" 
                },
                licencia: {
                    numero: licenciaNumero,
                    categoria: licenciaCategoria,
                    fechaVencimiento: licenciaVencimiento,
                    fotoSim: "" 
                }
            },
            fechaRegistro: new Date().toISOString()
        };

        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        if (usuarios.find(user => user.email === email)) {
            alert('Este correo electrónico ya está registrado.');
            return;
        }

        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        formRegistro.reset();
        // Opcional: Redirigir al login
        // window.location.href = 'login.html'; // Ajusta la ruta si es necesario
    });
});