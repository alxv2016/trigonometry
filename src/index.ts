import './scss/app.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import base from './assets/gem/color.jpg';
import normal from './assets/gem/normal.jpg';
import roughness from './assets/gem/rough.jpg';
import disp from './assets/gem/disp.png';
import ambient from './assets/gem/ambient.jpg';

// Create a canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// Handle window resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// Init a THREE scene
const scene = new THREE.Scene();

// Load texture
const textureLoader = new THREE.TextureLoader();

// Add geometries & material
const material = new THREE.MeshPhongMaterial({
  reflectivity: 1,
  shininess: 100,
});
const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), material);
const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.1, 64, 64), material);
const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.1, 64, 64), material);

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
ring1.position.y = 1;
ring2.position.y = 1;
sphere.position.y = 1;

sphere.castShadow = true;
sphere.receiveShadow = true;
ring1.castShadow = true;
ring1.receiveShadow = true;
ring2.castShadow = true;
ring2.receiveShadow = true;
plane.receiveShadow = true;

scene.add(plane, ring1, ring2, sphere);
// Lights
const ambientLight = new THREE.AmbientLight('white', 0.5);
const directionalLight = new THREE.DirectionalLight('white', 0.5);
directionalLight.position.set(1, 2, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
directionalLight.shadow.camera.near = 0.4;
directionalLight.shadow.camera.far = 8;
directionalLight.shadow.radius = 2;
const helper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(ambientLight, directionalLight);

// Add to scene
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 100);
camera.position.z = 6;

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;

// Render scene & camera
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
renderer.setClearColor('#01062D');

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  ring1.rotation.y = (Math.PI * elapsedTime) / 2;
  ring1.rotation.x = Math.sin(elapsedTime / 2);
  ring2.rotation.y = Math.PI * elapsedTime;
  ring2.rotation.x = Math.sin(elapsedTime);
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
