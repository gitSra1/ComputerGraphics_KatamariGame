import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let renderer, scene, camera;
let ball, candies = [], marshmallows = [], chocolates = [], hersheys = [],icecreams=[];
let candiesRemaining, marshmallowRemaining, chocolateRemaining, hersheysRemaining,icecreamRemaining;
let score = 0;
let gameOver = false;
let acceleration = 0.0005;
let deceleration = 0.0002;

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
  const planeSize = 47; // Adjust as needed

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
  }

  candiesRemaining = candies.length;
};

const addMarshmallows = async () => {
  // Load marshmallow model
  const marshmallowModel = await load('./assets/marshamallow/scene.gltf');

  // Get the size of the plane
  const planeSize = 47; // Adjust as needed

  // Create multiple instances of marshmallows
  for (let i = 0; i < 50; i++) {
    const marshmallow = marshmallowModel.clone();

    // Randomize position within the plane boundaries
    const x = Math.random() * planeSize - planeSize / 2;
    const z = Math.random() * planeSize - planeSize / 2;
    const y = 0;

    marshmallow.position.set(x, y, z);

    // Scale down the marshmallow
    const scaleFactor = 0.5; // Adjust as needed
    marshmallow.scale.set(scaleFactor, scaleFactor, scaleFactor);

    scene.add(marshmallow);
    marshmallows.push(marshmallow);
  }

  marshmallowRemaining = marshmallows.length;
};

const addChocolates = async () => {
  // Load chocolate model
  const chocolateModel = await load('./assets/chocolate/scene.gltf');

  // Get the size of the plane
  const planeSize = 47; // Adjust as needed

  // Create multiple instances of chocolates
  for (let i = 0; i < 50; i++) {
    const chocolate = chocolateModel.clone();

    // Randomize position within the plane boundaries
    const x = Math.random() * planeSize - planeSize / 2;
    const z = Math.random() * planeSize - planeSize / 2;
    const y = 0;

    chocolate.position.set(x, y, z);

    // Scale down the chocolate
    const scaleFactor = 0.3; // Adjust as needed
    chocolate.scale.set(scaleFactor, scaleFactor, scaleFactor);

    scene.add(chocolate);
    chocolates.push(chocolate);
  }

  chocolateRemaining = chocolates.length;
};

const addHersheys = async () => {
  // Load Hershey's model
  const hersheysModel = await load('./assets/hersheys/scene.gltf');

  // Get the size of the plane
  const planeSize = 47; // Adjust as needed

  // Create multiple instances of Hershey's
  for (let i = 0; i < 50; i++) {
    const hershey = hersheysModel.clone();

    // Randomize position within the plane boundaries
    const x = Math.random() * planeSize - planeSize / 2;
    const z = Math.random() * planeSize - planeSize / 2;
    const y = 0;

    hershey.position.set(x, y, z);

    // Scale down the Hershey's
    const scaleFactor = 0.001; // Adjust as needed
    hershey.scale.set(scaleFactor, scaleFactor, scaleFactor);

    scene.add(hershey);
    hersheys.push(hershey);
  }

  hersheysRemaining = hersheys.length;
};
const addiceCream = async () => {
  // Load marshmallow model
  const icecreamModel = await load('./assets/icecream/scene.gltf');

  // Get the size of the plane
  const planeSize = 47; // Adjust as needed

  // Create multiple instances of marshmallows
  for (let i = 0; i < 50; i++) {
    const icecream = icecreamModel.clone();

    // Randomize position within the plane boundaries
    const x = Math.random() * planeSize - planeSize / 2;
    const z = Math.random() * planeSize - planeSize / 2;
    const y = 0;

    icecream.position.set(x, y, z);

    // Scale down the marshmallow
    const scaleFactor = 0.02; // Adjust as needed
    icecream.scale.set(scaleFactor, scaleFactor, scaleFactor);

    scene.add(icecream);
    icecreams.push(icecream);
  }

  icecreamRemaining = icecreams.length;
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

  ball = await load('./assets/pumpkin/scene.gltf');
  ball.position.y += 1.5;
  ball.scale.set(1.0, 1.0, 1.0);
  scene.add(ball);

  // Initialize velocity vector here
  ball.velocity = new THREE.Vector3(0, 0, 0);

  await addCandies();
  await addMarshmallows();
  await addChocolates();
  await addHersheys();
  await addiceCream();
};

window.loop = (dt, input) => {
  // Check if the ball and its velocity are defined
  if (ball && ball.velocity && !gameOver) {
    const movementSpeed = 0.004;
    const rotationSpeed = 0.2;
    const rollingSpeed = 0.05; // Adjust rolling speed as needed

    // Check arrow key inputs
    const keysPressed = {
      ArrowUp: input.keys.has('ArrowUp'),
      ArrowDown: input.keys.has('ArrowDown'),
      ArrowLeft: input.keys.has('ArrowLeft'),
      ArrowRight: input.keys.has('ArrowRight')
    };

    // Accelerate or decelerate based on key inputs
    if (keysPressed.ArrowUp || keysPressed.ArrowDown || keysPressed.ArrowLeft || keysPressed.ArrowRight) {
      // Accelerate
      ball.velocity.x += acceleration * dt * (keysPressed.ArrowRight - keysPressed.ArrowLeft);
      ball.velocity.z += acceleration * dt * (keysPressed.ArrowDown - keysPressed.ArrowUp);
    } else {
      // Decelerate
      const decelerationVector = ball.velocity.clone().normalize().multiplyScalar(-deceleration * dt);
      ball.velocity.add(decelerationVector);

      // Clamp velocity to zero when close to stopping
      if (Math.abs(ball.velocity.x) < deceleration * dt) {
        ball.velocity.x = 0;
      }
      if (Math.abs(ball.velocity.z) < deceleration * dt) {
        ball.velocity.z = 0;
      }
    }

    // Apply velocity to position
    ball.position.x += ball.velocity.x;
    ball.position.z += ball.velocity.z;

    // Clamp ball position within boundaries
    const planeBoundaryX = 50/ 2.05;
    const planeBoundaryZ = 50 / 2.05;
    ball.position.x = Math.max(-planeBoundaryX, Math.min(planeBoundaryX, ball.position.x));
    ball.position.z = Math.max(-planeBoundaryZ, Math.min(planeBoundaryZ, ball.position.z));

    // Update rotation only if arrow keys are pressed
    if (keysPressed.ArrowUp || keysPressed.ArrowDown || keysPressed.ArrowLeft || keysPressed.ArrowRight) {
      //ball.rotation.y += rotationSpeed * dt;

      // Roll the ball around its forward axis (X-axis) based on movement direction
      ball.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), ball.velocity.x * rollingSpeed * dt);
    }
    if (ball.velocity.length() > 0.01) { // Check if the ball has significant velocity
      const rotationAxis = new THREE.Vector3(0, 1, 0).cross(ball.velocity.clone().normalize()); // Axis perpendicular to velocity
      const rotationAngle = ball.velocity.length() * dt * rollingSpeed; // Angle based on speed and time
  
      const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(rotationAxis, rotationAngle);
      ball.quaternion.multiply(rotationQuaternion); // Update ball's rotation 
  }
    // Update camera position to focus on the ball
    const cameraOffset = new THREE.Vector3(0, 10, 20);
    const ballPosition = ball.position.clone().add(cameraOffset);
    camera.position.copy(ballPosition);
    camera.lookAt(ball.position);
    const sound = new Audio('./assets/bonus-points-190035.mp3');

    // Function to play the sound effect
    const playSound = () => {
      sound.currentTime = 0; // Reset the sound to the beginning
      sound.play(); // Play the sound
    };
    
    // Check collision with candies
    candies.forEach((candy, index) => {
      if (ball.position.distanceTo(candy.position) < 2) {
        // If the ball touches the candy, remove the candy from the scene
        playSound();
        ball.attach(candy);
        scene.remove(candy);
        candies.splice(index, 1); // Remove candy from candies array
        candiesRemaining--;
        score++; // Increment score when candy is touched
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        if (candiesRemaining === 0 && marshmallowRemaining === 0 && chocolateRemaining === 0 && hersheysRemaining === 0 && icecreamRemaining===0) {
          // If all items are collected, display game over message
          const gameOverMessage = document.createElement('div');
          gameOverMessage.textContent = `Congratulations! You collected all items. Final Score: ${score}`;
          gameOverMessage.style.position = 'absolute';
          gameOverMessage.style.top = '50%';
          gameOverMessage.style.left = '50%';
          gameOverMessage.style.transform = 'translate(-50%, -50%)';
          gameOverMessage.style.fontSize = '24px';
          gameOverMessage.style.color = 'green';
          document.body.appendChild(gameOverMessage);
          gameOver = true; // Set game over flag
        }
      }
    });

    // Check collision with marshmallows
    marshmallows.forEach((marshmallow, index) => {
      if (ball.position.distanceTo(marshmallow.position) < 2) {
        // If the ball touches the marshmallow, remove the marshmallow from the scene
        playSound();
        ball.attach(marshmallow);
        scene.remove(marshmallow);
        marshmallows.splice(index, 1); // Remove marshmallow from marshmallows array
        marshmallowRemaining--;
        score++; // Increment score when marshmallow is touched
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        if (candiesRemaining === 0 && marshmallowRemaining === 0 && chocolateRemaining === 0 && hersheysRemaining === 0 && icecreamRemaining===0) {
          // If all items are collected, display game over message
          const gameOverMessage = document.createElement('div');
          gameOverMessage.textContent = `Congratulations! You collected all items. Final Score: ${score}`;
          gameOverMessage.style.position = 'absolute';
          gameOverMessage.style.top = '50%';
          gameOverMessage.style.left = '50%';
          gameOverMessage.style.transform = 'translate(-50%, -50%)';
          gameOverMessage.style.fontSize = '24px';
          gameOverMessage.style.color = 'green';
          document.body.appendChild(gameOverMessage);
          gameOver = true; // Set game over flag
        }
      }
    });

    // Check collision with chocolates
    chocolates.forEach((chocolate, index) => {
      if (ball.position.distanceTo(chocolate.position) < 2) {
        // If the ball touches the chocolate, remove the chocolate from the scene
        playSound();
        ball.attach(chocolate);
        scene.remove(chocolate);
        chocolates.splice(index, 1); // Remove chocolate from chocolates array
        chocolateRemaining--;
        score++; // Increment score when chocolate is touched
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        if (candiesRemaining === 0 && marshmallowRemaining === 0 && chocolateRemaining === 0 && hersheysRemaining === 0 && icecreamRemaining===0) {
          // If all items are collected, display game over message
          const gameOverMessage = document.createElement('div');
          gameOverMessage.textContent = `Congratulations! You collected all items. Final Score: ${score}`;
          gameOverMessage.style.position = 'absolute';
          gameOverMessage.style.top = '50%';
          gameOverMessage.style.left = '50%';
          gameOverMessage.style.transform = 'translate(-50%, -50%)';
          gameOverMessage.style.fontSize = '24px';
          gameOverMessage.style.color = 'green';
          document.body.appendChild(gameOverMessage);
          gameOver = true; // Set game over flag
        }
      }
    });

    // Check collision with Hershey's
    hersheys.forEach((hershey, index) => {
      if (ball.position.distanceTo(hershey.position) < 2) {
        // If the ball touches the Hershey's, remove it from the scene
        playSound();
        ball.attach(hershey);
        scene.remove(hershey);
        hersheys.splice(index, 1); // Remove Hershey's from hersheys array
        hersheysRemaining--;
        score += 2; // Increment score when Hershey's is touched (double score)
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        if (candiesRemaining === 0 && marshmallowRemaining === 0 && chocolateRemaining === 0 && hersheysRemaining === 0 && icecreamRemaining===0) {
          // If all items are collected, display game over message
          const gameOverMessage = document.createElement('div');
          gameOverMessage.textContent = `Congratulations! You collected all items. Final Score: ${score}`;
          gameOverMessage.style.position = 'absolute';
          gameOverMessage.style.top = '50%';
          gameOverMessage.style.left = '50%';
          gameOverMessage.style.transform = 'translate(-50%, -50%)';
          gameOverMessage.style.fontSize = '24px';
          gameOverMessage.style.color = 'green';
          document.body.appendChild(gameOverMessage);
          gameOver = true; // Set game over flag
        }
      }
    });
    icecreams.forEach((icecream, index) => {
      if (ball.position.distanceTo(icecream.position) < 2) {
        // If the ball touches the chocolate, remove the chocolate from the scene
        playSound();
        ball.attach(icecream);
        scene.remove(icecream);
        icecreams.splice(index, 1); // Remove chocolate from chocolates array
        icecreamRemaining--;
        score++; // Increment score when chocolate is touched
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        if (candiesRemaining === 0 && marshmallowRemaining === 0 && chocolateRemaining === 0 && hersheysRemaining === 0 && icecreamRemaining===0) {
          // If all items are collected, display game over message
          const gameOverMessage = document.createElement('div');
          gameOverMessage.textContent = `Congratulations! You collected all items. Final Score: ${score}`;
          gameOverMessage.style.position = 'absolute';
          gameOverMessage.style.top = '50%';
          gameOverMessage.style.left = '50%';
          gameOverMessage.style.transform = 'translate(-50%, -50%)';
          gameOverMessage.style.fontSize = '24px';
          gameOverMessage.style.color = 'green';
          document.body.appendChild(gameOverMessage);
          gameOver = true; // Set game over flag
        }
      }
    });
    // Render the scene
    renderer.render(scene, camera);
  }
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
