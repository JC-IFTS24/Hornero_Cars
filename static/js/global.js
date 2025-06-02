function abrirModal(e) {
  e.preventDefault(); // evita que el <a> recargue la página
  document.getElementById('modal-login').style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('modal-login').style.display = 'none';
}
  
fetch("data/usuarios.json")
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("usuarios", JSON.stringify(data));
  });
  
  
  const usuarioInput = document.getElementById("usuario")
  const contraseñaInput = document.getElementById("contraseña")
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  usuarioInput.addEventListener("focus", () => {
    document.getElementById("usuarioIncorrecto").style.visibility = "hidden";
  })

   contraseñaInput.addEventListener("focus", () => {
    document.getElementById("contraseñaIncorrecta").style.visibility = "hidden";
  })


  function iniciarSesion(){
     const usuarioEncontrado = usuarios.find(user => 
    (user.userId === usuarioInput.value || user.email === usuarioInput.value)
  );
     if (usuarioEncontrado && usuarioEncontrado.password === contraseñaInput.value) {
      alert("sesion exitosa")
      sessionStorage.setItem("usuarioActivo", JSON.stringify({ 
        userId: usuarioEncontrado.userId,
        rol: usuarioEncontrado.rol,
        nombre: usuarioEncontrado.nombreCompleto,
        email: usuarioEncontrado.email }));
      cerrarModal()
      personalizarNav()
    }

    if(!usuarioEncontrado){
      document.getElementById("usuarioIncorrecto").style.visibility = "visible";
      return; /* para que no ejecute el siguiente if si no se encontro usuario*/
    }

    if(usuarioEncontrado && usuarioEncontrado.password !== contraseñaInput.value){
      document.getElementById("contraseñaIncorrecta").style.visibility = "visible";
    }

  }
  function personalizarNav(){
    let navAdministrador = document.getElementById("nav")
   let navCliente = document.getElementById("sesion")
   const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"))
    if(usuarioActivo.rol === "Cliente"){
      navCliente.querySelector("a").remove()
      navCliente.innerHTML = `
      <a class="sesion" href="#">${usuarioActivo.userId} ▼</a>
                    <div class="dropdown_Contenido">
                        <a ></a>
                        <a ></a>
                        <a ></a>
                        <a href="#" onclick="cerrarSesion()">Cerrar sesión</a>
                    </div>`;
    }
    if(usuarioActivo.rol === "Administrador"){
      navAdministrador.querySelector("ul").remove()
      navAdministrador.innerHTML = `<ul class="adminNav_ul">
    <li id="imagen_Logo">
        <a href="admin_dashboard.html">
            <img src="static/img/horneroCarsBlanco2.png" height="95" alt="Hornero Cars">
        </a>
    </li>
    <li class="dropdownAdmin" id="reservaNav">
        <a href="">Gestión Reserva</a>
    </li>
    <li class="dropdownAdmin" id="vehiculoNav">
        <a href="">Gestión Vehículos</a>
    </li>
    <li class="dropdownAdmin" id="sucursalNav">
        <a href="">Gestión Sucursales</a>
    </li>
    <li class="dropdownAdmin" id="reportesNav">
        <a href="">Consultas y Reportes</a>
    </li>
    <li class="dropdown" id="sesionAdmin">
        <a href="#" class="sesion">${usuarioActivo.userId} ▼</a>
        <div class="dropdown_Contenido">
                        <a ></a>
                        <a ></a>
                        <a ></a>
                        <a href="#" onclick="cerrarSesion()">Cerrar sesión</a>
                    </div>
    </li>
</ul>`

    }
  }


  function cerrarSesion() {
  sessionStorage.removeItem("usuarioActivo");
  let pathParts = window.location.pathname.split("/");
  let rootPath = "/" + pathParts[1]; // Asume que /Proyecto/index.html es el nivel 1

  window.location.href = rootPath + "/index.html";
} 

let htmlOriginalSesion;

window.addEventListener("DOMContentLoaded", () => {
  const sesionIniciada = document.getElementById("sesion");
  htmlOriginalSesion = sesionIniciada.innerHTML; // guardamos el HTML original

  personalizarNav();
});