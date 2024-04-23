
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let renderer, scene, camera;
let ball, candies = [];
let candiesRemaining;
let score = 0;
let gameOver = false;
let object=[];
// Score display element
const scoreDisplay = document.createElement('div');
scoreDisplay.textContent = 'Score: 0';
scoreDisplay.style.position = 'absolute';
scoreDisplay.style.top = '10px';
scoreDisplay.style.right = '10px';
scoreDisplay.style.color = 'black';
document.body.appendChild(scoreDisplay);

const load = (url) => new Promise((resolve, reject) => {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
});

const addCandies = async () => {
  // Load candy model
  const candyModel = await load('./assets/candy/scene.gltf');

  // Get the size of the plane
  const planeSize = 50; // Adjust as needed

  // Create multiple instances of candies
  for (let i = 0; i < 50; i++) {
    const candy = candyModel.clone();

    // Randomize position within the plane boundaries
    const x = Math.random() * planeSize - planeSize / 2;
    const z = Math.random() * planeSize - planeSize / 2;
    const y = 0;

    candy.position.set(x, y, z);

    // Scale down the candy
    const scaleFactor = 0.1; // Adjust as needed
    candy.scale.set(scaleFactor, scaleFactor, scaleFactor);

    scene.add(candy);
    candies.push(candy);
  //  objects.push(candy);
  }

  candiesRemaining = candies.length; 
  //objectsRemaining = objects.length;
};



window.init = async () => {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xfff0f5, 1); 
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  const directionalLight = new THREE.DirectionalLight(0xadd8e6, 10);
  scene.add(directionalLight);

  const geometry = new THREE.PlaneGeometry(50, 50);
  const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./assets/candyshapes.png'); 
// Create material with texture
const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotateX(-Math.PI / 2); 
  scene.add(plane);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  ball = await load('./assets/raspberry_cell_gumball/scene.gltf');
  ball.position.y += 1.5; 
  ball.scale.set(1.0, 1.0, 1.0); 
  scene.add(ball);

  await addCandies();
  console.log('made a scene', ball);
};

window.loop = (dt, input) => {
  if (ball && !gameOver) {
    const movementSpeed = 0.006; 
    const rotationSpeed = 0.5;

    // Forward and backward movement - along the Z-axis
    if (input.keys.has('ArrowUp')) {
      ball.position.z -= movementSpeed * dt;
      ball.rotation.y += rotationSpeed * dt;
    }
    if (input.keys.has('ArrowDown')) {
      ball.position.z += movementSpeed * dt;
      ball.rotation.y += rotationSpeed * dt;
    }

    // Left and right movement - along the X-axis
    if (input.keys.has('ArrowLeft')) {
      ball.position.x -= movementSpeed * dt;
      ball.rotation.y += rotationSpeed * dt;
    }
    if (input.keys.has('ArrowRight')) {
      ball.position.x += movementSpeed * dt;
      ball.rotation.y += rotationSpeed * dt;
    }
    const planeBoundaryX = 50 / 2; // half the width
    const planeBoundaryZ = 50 / 2; // half the depth
    ball.position.x = Math.max(-planeBoundaryX, Math.min(planeBoundaryX, ball.position.x));
    ball.position.z = Math.max(-planeBoundaryZ, Math.min(planeBoundaryZ, ball.position.z));

    // Update camera position to focus on the ball
    const cameraOffset = new THREE.Vector3(0, 10, 20); 
    const ballPosition = ball.position.clone().add(cameraOffset);
    camera.position.copy(ballPosition);
    camera.lookAt(ball.position);

    // Check collision with candies
    candies.forEach((candy, index) => {
      if (ball.position.distanceTo(candy.position) < 2) {
        // If the ball touches the candy, remove the candy from the scene
        scene.remove(candy);
        candies.splice(index, 1); // Remove candy from candies array
        candiesRemaining--;
        score++; // Increment score when candy is touched
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        if (candiesRemaining === 0) {
          // If all candies are removed, display game over message
          const gameOverMessage = document.createElement('div');
          gameOverMessage.textContent = `Game Over. Score: ${score}`;
          gameOverMessage.style.position = 'absolute';
          gameOverMessage.style.top = '50%';
          gameOverMessage.style.left = '50%';
          gameOverMessage.style.transform = 'translate(-50%, -50%)';
          gameOverMessage.style.fontSize = '24px';
          gameOverMessage.style.color = 'red';
          document.body.appendChild(gameOverMessage);
          gameOver = true; // Set game over flag
        }
      }
    });
  }

  // Render the scene
  renderer.render(scene, camera);
};

// Function to handle arrow key down events
const handleKeyDown = (event) => {
  const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
  if (keys.includes(event.key)) {
    event.preventDefault(); // Prevent default scrolling behavior
  }
};

// Attach arrow key down event listener
window.addEventListener('keydown', handleKeyDown);

// Resize handler to update camera aspect ratio on window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
