import './scss/app.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';
import * as dat from 'dat.gui';
import matCapAsset from './assets/matcaps/8.png';
import base from './assets/flower/Flower_Bud_001_basecolor.jpg';
import normal from './assets/flower/Flower_Bud_001_normal.jpg';
import roughness from './assets/flower/Flower_Bud_001_roughness.jpg';
import height from './assets/flower/Flower_Bud_001_height.png';
import ambient from './assets/flower/Flower_Bud_001_ambientOcclusion.jpg';

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
const golden = textureLoader.load(matCapAsset);
const baseTexture = textureLoader.load(base);
const normalTexture = textureLoader.load(normal);
const roughnessTexture = textureLoader.load(roughness);
const heightTexture = textureLoader.load(height);
const ambientTexture = textureLoader.load(ambient);

// Add geometries
const geometry = new THREE.SphereGeometry(1, 100, 100);
const material = new THREE.MeshStandardMaterial({
  map: baseTexture,
  aoMap: ambientTexture,
  normalMap: normalTexture,
  displacementMap: heightTexture,
  displacementScale: 0.125,
  bumpMap: roughnessTexture,
});
const mesh = new THREE.Mesh(geometry, material);

mesh.geometry.setAttribute('uv2', new THREE.BufferAttribute(mesh.geometry.attributes.uv.array, 2));

scene.add(mesh);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

// Add to scene
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 100);
camera.position.z = 6;
// Render scene & camera
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
//const clock = new THREE.Clock()

// gsap.to(mesh.rotation, {
//   duration: 3,
//   ease: 'linear',
//   y: Math.PI * 2,
//   repeat: -1,
// });

gsap.ticker.add((time) => {
  mesh.rotation.y = Math.sin(time * 1.4);
  mesh.rotation.x = Math.cos(time * 1.4);
  // camera.lookAt(mesh.position);
  renderer.render(scene, camera);
});
