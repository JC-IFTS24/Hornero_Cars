document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.reserva-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-step-btn');
    const prevButtons = document.querySelectorAll('.prev-step-btn');
    const sameLocationCheckbox = document.getElementById('same-location');
    const returnLocationInput = document.getElementById('return-location');
    const confirmReservationBtn = document.querySelector('.confirm-reservation-btn');

    // Nuevos elementos para la selección de vehículos y filtros
    const carFilterButtons = document.querySelectorAll('.filter-btn');
    const carCards = document.querySelectorAll('.car-card');
    const selectCarButtons = document.querySelectorAll('.select-car-btn');
    const selectCarNextBtn = document.getElementById('selectCarNextBtn'); // Botón 'Continuar' en Paso 2

    let currentStep = 1;

    // Objeto para almacenar todos los datos de la reserva
    let reservationData = {
        pickupLocation: '',
        returnLocation: '',
        pickupDate: '',
        pickupTime: '',
        returnDate: '',
        returnTime: '',
        selectedCar: null, // Guardará { id, name, type, price }
        selectedExtras: [], // Guardará [{ name, price }]
        driverFirstName: '',
        driverLastName: '',
        driverEmail: '',
        driverPhone: '',
        totalPrice: 0
    };

    // --- Funciones de navegación y progreso ---
    function showStep(stepNumber) {
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active-step');
                // Si es el paso 4, actualiza el resumen con los datos actuales
                if (stepNumber === 4) {
                    updateReservationSummary();
                }
            } else {
                step.classList.remove('active-step');
            }
        });
        updateProgressBar(stepNumber);
        currentStep = stepNumber;

        // Deshabilitar botón "Continuar" del Paso 2 si no hay coche seleccionado al entrar al paso 2
        if (stepNumber === 2) {
            selectCarNextBtn.disabled = (reservationData.selectedCar === null);
        }
    }

    function updateProgressBar(stepNumber) {
        progressSteps.forEach((pStep, index) => {
            if (index + 1 <= stepNumber) {
                pStep.classList.add('active');
            } else {
                pStep.classList.remove('active');
            }
        });
    }

    // --- Validación y Recopilación de Datos Antes de Avanzar ---
    nextButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const nextStep = parseInt(e.target.dataset.nextStep);

            // Recopilar datos del paso actual antes de validar y avanzar
            collectDataFromCurrentStep(currentStep);

            // Validaciones específicas para cada paso
            if (currentStep === 1 && !validateStep1()) {
                alert('Por favor, completa todos los campos de fechas y ubicación.');
                return;
            }
            if (currentStep === 2 && reservationData.selectedCar === null) {
                alert('Por favor, selecciona un vehículo para continuar.');
                return;
            }
            if (currentStep === 3 && !validateStep3()) {
                 alert('Por favor, completa todos los datos personales requeridos.');
                 return;
            }

            showStep(nextStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const prevStep = parseInt(e.target.dataset.prevStep);
            showStep(prevStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // --- Lógica de Recopilación de Datos ---
    function collectDataFromCurrentStep(step) {
        if (step === 1) {
            reservationData.pickupLocation = document.getElementById('pickup-location').value;
            reservationData.returnLocation = document.getElementById('return-location').value;
            reservationData.pickupDate = document.getElementById('pickup-date').value;
            reservationData.pickupTime = document.getElementById('pickup-time').value;
            reservationData.returnDate = document.getElementById('return-date').value;
            reservationData.returnTime = document.getElementById('return-time').value;

            // Si "Mismo lugar de recogida" está marcado y el campo de devolución está deshabilitado, copia el valor.
            if (sameLocationCheckbox.checked && returnLocationInput.disabled) {
                reservationData.returnLocation = reservationData.pickupLocation;
            }

        } else if (step === 3) {
            reservationData.driverFirstName = document.getElementById('first-name').value;
            reservationData.driverLastName = document.getElementById('last-name').value;
            reservationData.driverEmail = document.getElementById('email').value;
            reservationData.driverPhone = document.getElementById('phone').value;

            reservationData.selectedExtras = [];
            document.querySelectorAll('input[name="extra"]:checked').forEach(checkbox => {
                const extraName = checkbox.parentNode.textContent.trim().split(' - ')[0]; // Nombre sin precio
                const extraPrice = parseFloat(checkbox.dataset.extraPrice);
                reservationData.selectedExtras.push({ name: extraName, price: extraPrice });
            });
        }
        console.log("Datos de reserva actualizados:", reservationData);
    }

    // --- Validaciones de Pasos ---
    function validateStep1() {
        const pickupLocation = document.getElementById('pickup-location').value.trim();
        const pickupDate = document.getElementById('pickup-date').value.trim();
        const pickupTime = document.getElementById('pickup-time').value.trim();
        const returnDate = document.getElementById('return-date').value.trim();
        const returnTime = document.getElementById('return-time').value.trim();
        const returnLocation = document.getElementById('return-location').value.trim(); // Se valida si no está deshabilitado

        if (!pickupLocation || !pickupDate || !pickupTime || !returnDate || !returnTime) {
            return false;
        }

        // Si "Mismo lugar de recogida" no está marcado, validar el campo de devolución
        if (!sameLocationCheckbox.checked && !returnLocation) {
            return false;
        }

        // Validación básica de fechas (que la fecha de devolución sea posterior o igual a la de recogida)
        const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
        const returnDateTime = new Date(`${returnDate}T${returnTime}`);
        if (returnDateTime < pickupDateTime) {
            alert('La fecha y hora de devolución no puede ser anterior a la de recogida.');
            return false;
        }

        return true;
    }

    function validateStep3() {
        const firstName = document.getElementById('first-name').value.trim();
        const lastName = document.getElementById('last-name').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!firstName || !lastName || !email) {
            return false;
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un email válido.');
            return false;
        }

        return true;
    }


    // --- Lógica para "Mismo lugar de recogida" ---
    if (sameLocationCheckbox && returnLocationInput) {
        sameLocationCheckbox.addEventListener('change', () => {
            returnLocationInput.disabled = sameLocationCheckbox.checked;
            if (sameLocationCheckbox.checked) {
                // Copiar el valor del lugar de recogida si se marca
                returnLocationInput.value = document.getElementById('pickup-location').value;
            } else {
                returnLocationInput.value = ''; // Limpiar si se desmarca
            }
        });
        // Inicializar estado al cargar la página
        returnLocationInput.disabled = sameLocationCheckbox.checked;
        if (sameLocationCheckbox.checked) {
            returnLocationInput.value = document.getElementById('pickup-location').value;
        }
    }


    // --- Lógica de Selección de Vehículo (Paso 2) ---
    selectCarButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            carCards.forEach(card => card.classList.remove('selected')); // Deseleccionar todos
            const clickedCard = e.target.closest('.car-card');
            clickedCard.classList.add('selected'); // Seleccionar este

            // Guardar los detalles del coche seleccionado en reservationData
            reservationData.selectedCar = {
                id: e.target.dataset.carId,
                name: e.target.dataset.carName,
                type: e.target.dataset.carType, // ¡Ahora guardamos el tipo!
                pricePerDay: parseFloat(clickedCard.querySelector('.car-price').dataset.price)
            };
            console.log('Coche seleccionado:', reservationData.selectedCar);

            // Habilitar el botón "Continuar" del Paso 2
            selectCarNextBtn.disabled = false;
        });
    });

    // --- Lógica para el filtro de tipo de auto (CORREGIDA) ---
    carFilterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filterType = e.target.dataset.filter;

            carFilterButtons.forEach(btn => btn.classList.remove('active')); // Desactivar todos los filtros
            e.target.classList.add('active'); // Activar el filtro actual

            carCards.forEach(card => {
                if (filterType === 'all' || card.dataset.type === filterType) {
                    card.classList.remove('hidden'); // Remover la clase hidden
                } else {
                    card.classList.add('hidden'); // Añadir la clase hidden
                }
            });
        });
    });


    // --- Actualización del Resumen de la Reserva (Paso 4) ---
    function updateReservationSummary() {
        // Asumiendo que los datos de reservationData ya están recopilados
        const data = reservationData;

        // Calcular duración del alquiler (en días)
        let numberOfDays = 0;
        if (data.pickupDate && data.returnDate && data.pickupTime && data.returnTime) { // Asegurarse de que las horas también estén presentes
            const pickupDateTime = new Date(`${data.pickupDate}T${data.pickupTime}`);
            const returnDateTime = new Date(`${data.returnDate}T${data.returnTime}`);
            const diffTime = Math.abs(returnDateTime - pickupDateTime);
            numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Redondea hacia arriba para días parciales
            if (numberOfDays === 0 && diffTime > 0) numberOfDays = 1; // Si es menos de un día pero no 0, cuenta como 1 día
        }

        // Calcular precio total
        let totalCost = 0;
        if (data.selectedCar && data.selectedCar.pricePerDay) {
            totalCost += data.selectedCar.pricePerDay * numberOfDays;
        }
        data.selectedExtras.forEach(extra => {
            totalCost += extra.price * numberOfDays; // Asume que los extras también son por día
        });
        reservationData.totalPrice = totalCost; // Guardar el total calculado


        // Rellenar el resumen en el HTML
        document.getElementById('summary-dates-times').textContent =
            `${data.pickupDate} ${data.pickupTime} - ${data.returnDate} ${data.returnTime} (${numberOfDays} días)`;
        document.getElementById('summary-location-detail').textContent =
            `${data.pickupLocation} (Recogida) / ${data.returnLocation} (Devolución)`;

        if (data.selectedCar) {
            document.getElementById('summary-car-detail').textContent =
                `${data.selectedCar.name} ($${data.selectedCar.pricePerDay}/día)`;
            document.getElementById('summary-car-type').textContent = data.selectedCar.type; // Mostrar el tipo de vehículo
        } else {
            document.getElementById('summary-car-detail').textContent = 'No se ha seleccionado ningún vehículo.';
            document.getElementById('summary-car-type').textContent = 'N/A';
        }

        const extrasNames = data.selectedExtras.map(extra => extra.name).join(', ') || 'Ninguno';
        document.getElementById('summary-extras-detail').textContent = extrasNames;

        document.getElementById('summary-driver-detail').textContent = `${data.driverFirstName} ${data.driverLastName}`;
        document.getElementById('summary-email-detail').textContent = data.driverEmail;
        document.getElementById('summary-phone-detail').textContent = data.driverPhone || 'No proporcionado';

        document.getElementById('summary-total').textContent = `$${totalCost.toFixed(2)}`;
    }


    // --- Lógica para "Confirmar Reserva" (Paso 4) ---
    if (confirmReservationBtn) {
        confirmReservationBtn.addEventListener('click', () => {
            // Última recopilación de datos por si acaso
            collectDataFromCurrentStep(currentStep);

            // Aquí es donde enviarías `reservationData` a tu servidor (ej. usando fetch API)
            console.log("Datos finales de la reserva para enviar:", reservationData);
            alert('¡Reserva Confirmada! (Se enviarán los datos al servidor)');

            // Idealmente, redirigir a una página de agradecimiento
            // window.location.href = 'agradecimiento.html';
        });
    }

    // --- Inicialización ---
    showStep(1); // Muestra el primer paso al cargar la página
    // Activa el filtro "Todos" por defecto al cargar
    if (carFilterButtons.length > 0) {
        carFilterButtons[0].click(); // Simula un clic en el botón "Todos" para mostrar todos los coches inicialmente
    }
});