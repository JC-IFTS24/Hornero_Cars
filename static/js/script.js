document.addEventListener('DOMContentLoaded', function() {
    // --- Carousel de imagenes ----------------------------------------------------
    let slideIndex = 1;
    showSlides(slideIndex);

    // Funciones para navegar con flechas
    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    }

    // Función para navegar con los puntos 
    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    }

    function showSlides(n) {
        let i;
        let slides = document.getElementsByClassName("carousel-slide"); // flechas
        let dots = document.getElementsByClassName("dot"); // puntitos

        // Reinicia el índice si se excede el número de slides o si es menor que 1
        if (n > slides.length) { slideIndex = 1; }
        if (n < 1) { slideIndex = slides.length; }

        // Oculta todos los slides
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        // Remueve la clase 'active' de todos los puntos
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        // Muestra el slide actual y agrega la clase 'active' al punto correspondiente
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    }

    // Auto-avance del carrusel
    let autoSlideInterval = setInterval(function() {
        plusSlides(1);
    }, 5000); // Cambia de imagen cada 5 segundos (5000 milisegundos)

    // Pausar auto-avance al pasar el mouse por el carrusel
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) { // Asegura que el contenedor exista
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval); // Pausa el auto-avance
        });
        carouselContainer.addEventListener('mouseleave', () => {
            // Reanuda el auto-avance
            autoSlideInterval = setInterval(function() {
                plusSlides(1);
            }, 5000);
        });
    }


    // --- Funcionalidad del botón "Alquilar Ahora" ---
    const alquilarAhora = document.getElementById('alquilarAhora');

    if (alquilarAhora) { // Verifica si el botón existe en el DOM
        alquilarAhora.addEventListener('click', function() {
            // Cuando se hace clic en "Alquilar Ahora":
            // Opción 1: Redirigir a una página de reserva
            window.location.href = 'templates/reserva.html'; 
        });
    } 
});