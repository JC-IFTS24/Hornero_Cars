function abrirModal(e) {
  e.preventDefault(); // evita que el <a> recargue la página
  document.getElementById('modal-login').style.display = 'flex';
}

function cerrarModal() {
  document.getElementById('modal-login').style.display = 'none';
}
  

  const adminsValidos = ["Juliano", "Brendo", "Guillermino", "Liliano"]
  const contraseñaAdmin = "julikpo"
  const usuariosCliente = ["Usuario"]
  const contraseñasCliente = ["user"]
  const usuarioInput = document.getElementById("usuario")
  const contraseñaInput = document.getElementById("contraseña")
  var sesionIniciadaAdmin = false
  var seionIniciadaCliente = false
  var nombreSesion

  usuarioInput.addEventListener("focus", () => {
    document.getElementById("usuarioIncorrecto").style.visibility = "hidden";
  })

   contraseñaInput.addEventListener("focus", () => {
    document.getElementById("contraseñaIncorrecta").style.visibility = "hidden";
  })


  function iniciarSesion(){ 
  if (adminsValidos.includes(usuarioInput.value) && 
  contraseñaAdmin.includes(contraseñaInput.value)){
    alert("Sesión exitosa de admin");
    cerrarModal()
    sesionIniciadaAdmin = true
    nombreSesion = usuarioInput.value
  }

  if(usuariosCliente.includes(usuarioInput.value) && 
  contraseñasCliente.includes(contraseñaInput.value)){
    alert("Sesión exitosa de cliente")
    cerrarModal()
    seionIniciadaCliente = true
    nombreSesion = usuarioInput.value
  }

  if (!adminsValidos.includes(usuarioInput.value)){
    document.getElementById("usuarioIncorrecto").style.visibility = "visible";
    }
  
  if(adminsValidos.includes(usuarioInput.value) && 
  !contraseñaAdmin.includes(contraseñaInput.value)){
    document.getElementById("contraseñaIncorrecta").style.visibility = "visible";}
  }

  function personalizarNav(){
    
  }