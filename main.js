let username = "";
let avatar = "";
let scene, camera, renderer, player;
let players = {};
let controls = {};
let playerRef;

function startGame() {
  username = document.getElementById("username").value;
  avatar = document.getElementById("avatarSelect").value;
  if (!username) return alert("Digite seu nome");
  document.getElementById("login").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";
  initGame();
}

function initGame() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshBasicMaterial({ color: 0x333333 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: avatar === "blue" ? 0x0000ff : avatar === "red" ? 0xff0000 : 0x00ff00 });
  player = new THREE.Mesh(geometry, material);
  player.position.set(Math.random() * 10 - 5, 0.5, Math.random() * 10 - 5);
  scene.add(player);

  camera.position.set(0, 10, 10);
  camera.lookAt(player.position);

  document.addEventListener("keydown", e => controls[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", e => controls[e.key.toLowerCase()] = false);

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
        const cube = new THREE.Mesh(geometry, mat);
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

  renderer.render(scene, camera);
}
