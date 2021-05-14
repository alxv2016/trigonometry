import './scss/app.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
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

// Add geometries & material
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
// const group = new THREE.Group();
// const center = new THREE.Vector3();
// new THREE.Box3().setFromObject(group).getCenter(center);
// group.position.copy(center).multiplyScalar(-1);

// Add to scene
const axesHelper = new THREE.AxesHelper(5);
axesHelper.visible = true;
scene.add(axesHelper);
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 800);
camera.position.z = 90;

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

// Animation ticks
const clock = new THREE.Clock();
const tick = () => {
  const time = clock.getElapsedTime();

  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(tick);
};
tick();
