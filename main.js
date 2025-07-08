let username = "";
let avatar = "";

function startGame() {
  username = document.getElementById("username").value;
  avatar = document.getElementById("avatarSelect").value;
  if (username.trim() === "") return alert("Digite seu nome");

  document.getElementById("login").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";

  initGame();
}

function initGame() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Piso
  const floorGeo = new THREE.BoxGeometry(20, 0.1, 20);
  const floorMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.5;
  scene.add(floor);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}
