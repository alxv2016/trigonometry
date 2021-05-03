import './scss/app.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';
import * as dat from 'dat.gui';
import matCapAsset from './assets/matcaps/9.png';

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
  camera.updateProjectionMatrix();
  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Init a THREE scene
const scene = new THREE.Scene();

// Add geometries
const geometry = new THREE.BoxGeometry(1, 1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 'lightblue'});
const sphere = new THREE.Mesh(geometry, material);

// Add to scene
scene.add(sphere);
// Add camera and define it's Z axis and FOV
const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 4;
// Render scene & camera
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

gsap.ticker.add(() => {
  renderer.render(scene, camera);
});
