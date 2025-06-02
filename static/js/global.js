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
  
  const adminsValidos = ["Juliano", "Brendo", "Guillermino", "Liliano"]
  const contraseñaAdmin = "julikpo"
  const usuariosCliente = ["Usuario"]
  const contraseñasCliente = ["user"]
  const usuarioInput = document.getElementById("usuario")
  const contraseñaInput = document.getElementById("contraseña")
  var sesionIniciadaAdmin = false
  var seionIniciadaCliente = false
  var nombreSesion
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
      cerrarModal()
      sesionIniciadaAdmin = true
    }

    if(!usuarioEncontrado){
      document.getElementById("usuarioIncorrecto").style.visibility = "visible";
    }

    if(usuarioEncontrado && usuarioEncontrado.password !== contraseñaInput.value){
      document.getElementById("contraseñaIncorrecta").style.visibility = "visible";
    }

  }
  function personalizarNav(){
    
  }