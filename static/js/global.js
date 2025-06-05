

let usuarios = [];
let htmlOriginalSesion;

window.addEventListener("DOMContentLoaded", () => {
  const usuariosGuardados = localStorage.getItem("usuarios");
  
  if (usuariosGuardados) {
    usuarios = JSON.parse(usuariosGuardados);
  } else {
    fetch("data/usuarios.json")
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("usuarios", JSON.stringify(data));
        usuarios = data;
      });
  }
 const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  if (!usuarioActivo) return;

  const sesionIniciada = document.getElementById("sesion");
  const nav = document.getElementById("nav");

  if (sesionIniciada) {
    htmlOriginalSesion = sesionIniciada.innerHTML;
  }

  if (nav || sesionIniciada) {
    personalizarNav();
  }

}

);


function abrirModal(e) {
  e.preventDefault();
  document.getElementById('modal-login').style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('modal-login').style.display = 'none';
}

function iniciarSesion() {
  const usuarioInput = document.getElementById("usuario");
  const contraseñaInput = document.getElementById("contraseña");

  const usuarioEncontrado = usuarios.find(user =>
    user.userId === usuarioInput.value || user.email === usuarioInput.value
  );

  if (usuarioEncontrado && usuarioEncontrado.password === contraseñaInput.value) {
    alert("Sesión exitosa");
    sessionStorage.setItem("usuarioActivo", JSON.stringify({
      userId: usuarioEncontrado.userId,
      rol: usuarioEncontrado.rol,
      nombreCompleto: usuarioEncontrado.nombreCompleto,
      email: usuarioEncontrado.email
    }));
    cerrarModal();

    if (usuarioEncontrado.rol === "Administrador") {
      redireccionarAdminDashboard();
    } else {
      redireccionarClienteDashboard()
      personalizarNav();
    }
    return;
  }

  if (!usuarioEncontrado) {
    document.getElementById("usuarioIncorrecto").style.visibility = "visible";
    return;
  }

  if (usuarioEncontrado.password !== contraseñaInput.value) {
    document.getElementById("contraseñaIncorrecta").style.visibility = "visible";
  }
}

function personalizarNav() {
  const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
  if (!usuarioActivo) return;

  let navAdministrador = document.getElementById("nav");
  let navCliente = document.getElementById("sesion");

  if (usuarioActivo.rol === "Cliente" && navCliente) {
    navCliente.querySelector("a")?.remove();
    navCliente.innerHTML = `
      <a class="sesion" href="#">${usuarioActivo.userId} ▼</a>
      <div class="dropdown_Contenido">
        <a ></a>
        <a ></a>
        <a ></a>
        <a href="#" onclick="cerrarSesion()">Cerrar sesión</a>
      </div>`;
  }

  if (usuarioActivo.rol === "Administrador" && navAdministrador) {
    navAdministrador.querySelector("ul")?.remove();
    navAdministrador.innerHTML = `
      <ul class="adminNav_ul">
        <li id="imagen_LogoAdmin">
          <a href="admin_dashboard.html">
            <img src="../static/img/horneroCarsBlanco2.png" height="95" alt="Hornero Cars">
          </a>
        </li>
        <li class="dropdown" id="sesionAdmin">
          <a href="#" class="sesion" >${usuarioActivo.userId} ▼</a>
          <div class="dropdown_Contenido">
            <a ></a>
            <a ></a>
            <a href="#" onclick="redireccionarAdminDashboard()" >"Dashboard"</a>
            <a href="#" onclick="cerrarSesion()">Cerrar sesión</a>
          </div>
        </li>
      </ul>`;
  }
}

function cerrarSesion() {
  sessionStorage.removeItem("usuarioActivo");
  let pathParts = window.location.pathname.split("/");
  let rootPath = "/" + pathParts[1];
  window.location.href = rootPath + "/index.html";
}



function redireccionarAdminDashboard() {
  let pathParts = window.location.pathname.split("/");
  let rootPath = "/" + pathParts[1];
  window.location.href = rootPath + "/templates/dashboardAdmin.html";
} 

function redireccionarClienteDashboard(){
  let pathParts = window.location.pathname.split("/");
  let rootPath = "/" + pathParts[1];
  window.location.href = rootPath + "/templates/dashboardCliente.html";
}