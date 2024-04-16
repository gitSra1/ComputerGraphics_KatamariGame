import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let renderer, scene, camera;

const load = (url) => new Promise((resolve, reject) => {
  const loader = new GLTFLoader();
  loader.load(url, (gltf) => resolve(gltf.scene), undefined, reject);
});

window.init = async () => {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xf0f0f0, 1); // Set background color to light gray
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  scene.add(directionalLight);
  const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
  scene.add(helper);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  const ball = await load('./assets/raspberry_cell_gumball/scene.gltf');
  scene.add(ball);

  console.log('made a scene', ball);

  // Initialize camera position to be behind the ball
  camera.position.set(5, 5, 5);
  camera.lookAt(ball.position);

  // Movement and rotation speeds
  let acc = 0.0001;
  let drag = 0.98;
  let turnSpeed = 0.1;
  let velocity = 0;
  const movementSpeed = 0.005;
  const rotationSpeed = 0.1;

  window.loop = (dt, input) => {
    if (ball) {
      // Forward movement - along the Z-axis
      if (input.keys.has('ArrowUp')) {
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(ball.quaternion);
       // ball.position.add(forward.multiplyScalar(movementSpeed * dt));
        ball.position.z -= movementSpeed * dt;
        ball.rotation.y += rotationSpeed * dt;
  
      }
      if (input.keys.has('ArrowDown')) {
        ball.position.z += movementSpeed * dt;
        ball.rotation.y += rotationSpeed * dt;
      }
  
  

      // Right and left rotation
      if (input.keys.has('ArrowLeft')) {
       ball.position.x -= movementSpeed * dt;
        ball.rotation.y += rotationSpeed * dt;
  

      }
      if (input.keys.has('ArrowRight')) {
       ;
     ball.position.x += movementSpeed * dt;
      ball.rotation.y += rotationSpeed * dt;

      }
      const forward = new THREE.Vector3();
      ball.getWorldDirection(forward);
      ball.position.add(forward.clone().multiplyScalar(velocity*dt));
      

      // Keep the camera looking at the ball
      camera.lookAt(ball.position);
    }

    // Render the scene
    renderer.render(scene, camera);
  };
};
