let username = "";
let avatar = "";
let scene, camera, renderer, player;
let keys = {};
let questionBlocks = [];
let currentQuestion = null;
let answeredQuestions = new Set();

function startGame() {
  username = document.getElementById("username").value;
  avatar = document.getElementById("avatarSelect").value;
  if (username.trim() === "") return alert("Digite seu nome");

  document.getElementById("login").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";

  initGame();
}

function initGame() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Piso
  const floorGeo = new THREE.BoxGeometry(100, 1, 100);
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -1;
  scene.add(floor);

  // Paredes (labirinto simples 5x5)
  const wallGeo = new THREE.BoxGeometry(2, 2, 2);
  const wallMat = new THREE.MeshBasicMaterial({ color: 0x4444ff });
  const layout = [
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0],
    [1, 0, 1, 1, 1],
  ];
  for (let z = 0; z < layout.length; z++) {
    for (let x = 0; x < layout[z].length; x++) {
      if (layout[z][x] === 1) {
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set(x * 2, 0, z * 2);
        scene.add(wall);
      }
    }
  }

  // Bloco de pergunta
  const questionGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  const questionMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const questionBlock = new THREE.Mesh(questionGeo, questionMat);
  questionBlock.position.set(2, 0.75, 6);
  questionBlock.name = "question_0";
  scene.add(questionBlock);
  questionBlocks.push(questionBlock);

  // Jogador
  const playerGeo = new THREE.BoxGeometry(1, 1, 1);
  const playerMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(playerGeo, playerMat);
  player.position.set(2, 0.5, 2);
  scene.add(player);

  camera.position.set(2, 5, 7);
  camera.lookAt(player.position);

  document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  let speed = 0.1;
  if (keys["w"]) player.position.z -= speed;
  if (keys["s"]) player.position.z += speed;
  if (keys["a"]) player.position.x -= speed;
  if (keys["d"]) player.position.x += speed;

  camera.position.x = player.position.x;
  camera.position.z = player.position.z + 5;
  camera.lookAt(player.position);

  checkQuestions();
  renderer.render(scene, camera);
}

function checkQuestions() {
  questionBlocks.forEach((block) => {
    if (!answeredQuestions.has(block.name) &&
        player.position.distanceTo(block.position) < 1.5) {
      showQuestion(0, block.name);
    }
  });
}

function showQuestion(index, blockName) {
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      currentQuestion = data[index];
      document.getElementById("questionText").innerText = currentQuestion.pergunta;
      const answersDiv = document.getElementById("answers");
      answersDiv.innerHTML = "";
      currentQuestion.alternativas.forEach((alt, i) => {
        const btn = document.createElement("button");
        btn.innerText = alt;
        btn.onclick = () => {
          if (i === currentQuestion.resposta) {
            alert("Correto!");
            answeredQuestions.add(blockName);
            document.getElementById("questionBox").style.display = "none";
          } else {
            alert("Errado! Tente de novo.");
          }
        };
        answersDiv.appendChild(btn);
      });
      document.getElementById("questionBox").style.display = "block";
    });
}
