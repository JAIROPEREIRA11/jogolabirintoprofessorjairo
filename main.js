let username = "";
let avatar = "";
let playerRef, scene, camera, renderer, player;
let players = {};
let controls = {};
let perguntasRespondidas = new Set();
let perguntas = [];
let labirinto = [];

function startGame() {
  username = document.getElementById("username").value;
  avatar = document.getElementById("avatarSelect").value;
  if (!username) return alert("Digite seu nome");
  document.getElementById("login").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";

  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      labirinto = data.labirinto;
      perguntas = data.perguntas;
      initGame();
    });
}

function initGame() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.addEventListener("keydown", e => controls[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", e => controls[e.key.toLowerCase()] = false);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color: 0x333333 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const wallMat = new THREE.MeshBasicMaterial({ color: 0x4444ff });
  const perguntaMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  let qIndex = 0;
  for (let z = 0; z < labirinto.length; z++) {
    for (let x = 0; x < labirinto[z].length; x++) {
      const tipo = labirinto[z][x];
      if (tipo === '1') {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), wallMat);
        wall.position.set(x, 0.5, z);
        scene.add(wall);
      }
      if (tipo === 'P') {
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const mat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        player = new THREE.Mesh(geo, mat);
        player.position.set(x, 0.5, z);
        scene.add(player);
        camera.position.set(x, 5, z + 5);
        camera.lookAt(player.position);
      }
      if (tipo === 'Q') {
        const bloco = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), perguntaMat);
        bloco.position.set(x, 0.5, z);
        bloco.name = `pergunta_${qIndex}`;
        bloco.userData.pergunta = perguntas[qIndex];
        scene.add(bloco);
        qIndex++;
      }
    }
  }

  playerRef = db.ref("players/" + username);
  playerRef.set({ x: player.position.x, z: player.position.z, avatar });
  playerRef.onDisconnect().remove();

  db.ref("players").on("value", snapshot => {
    const data = snapshot.val();
    for (let name in players) {
      if (!data || !data[name]) {
        scene.remove(players[name].mesh);
        delete players[name];
      }
    }
    for (let name in data) {
      if (name === username) continue;
      if (!players[name]) {
        const color = data[name].avatar === "blue" ? 0x0000ff : data[name].avatar === "red" ? 0xff0000 : 0x00ff00;
        const mat = new THREE.MeshBasicMaterial({ color });
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
        cube.position.y = 0.5;
        scene.add(cube);
        players[name] = { mesh: cube };
      }
      players[name].mesh.position.x = data[name].x;
      players[name].mesh.position.z = data[name].z;
    }
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const speed = 0.1;
  if (controls["w"]) player.position.z -= speed;
  if (controls["s"]) player.position.z += speed;
  if (controls["a"]) player.position.x -= speed;
  if (controls["d"]) player.position.x += speed;

  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 5;
  camera.lookAt(player.position);

  playerRef.set({ x: player.position.x, z: player.position.z, avatar });

  verificarPerguntas();
  renderer.render(scene, camera);
}

function verificarPerguntas() {
  scene.children.forEach(obj => {
    if (obj.name?.startsWith("pergunta_") && !perguntasRespondidas.has(obj.name)) {
      if (player.position.distanceTo(obj.position) < 1) {
        mostrarPergunta(obj.userData.pergunta, obj.name);
      }
    }
  });
}

function mostrarPergunta(pergunta, blocoId) {
  const qbox = document.getElementById("questionBox");
  const answersDiv = document.getElementById("answers");
  document.getElementById("questionText").innerText = pergunta.questao;
  answersDiv.innerHTML = "";
  pergunta.alternativas.forEach((alt, i) => {
    const btn = document.createElement("button");
    btn.innerText = alt;
    btn.onclick = () => {
      if (i === pergunta.correta) {
        alert("Correto!");
        perguntasRespondidas.add(blocoId);
        qbox.style.display = "none";
      } else {
        alert("Errado, tente novamente.");
      }
    };
    answersDiv.appendChild(btn);
  });
  qbox.style.display = "block";
}
