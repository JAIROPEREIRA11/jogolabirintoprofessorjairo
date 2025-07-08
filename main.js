let username = "";
let avatar = "";

function startGame() {
  username = document.getElementById("username").value;
  avatar = document.getElementById("avatarSelect").value;
  if (username.trim() === "") return alert("Digite seu nome");

  document.getElementById("login").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";

  // Firebase e renderização do jogo aqui
  console.log("Iniciando jogo com:", username, avatar);
}
