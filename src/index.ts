import './scss/app.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import colorAsset from './assets/door/color.jpg';
import alphaAsset from './assets/door/alpha.jpg';
import metalnessAsset from './assets/door/metalness.jpg';
import heightAsset from './assets/door/height.jpg';
import normalAsset from './assets/door/normal.jpg';
import roughnessAsset from './assets/door/roughness.jpg';
import ambientAsset from './assets/door/ambientOcclusion.jpg';
import checkboxAsset from './assets/minecraft.png';
import matCapAsset from './assets/matcaps/9.png';
import gradientAsset from './assets/gradients/3.jpg';

// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
// Debug
const gui = new dat.GUI();

// full screen resizing
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// Scene
const scene = new THREE.Scene();

//Textures
const textureLoader = new THREE.TextureLoader();
const doorColor = textureLoader.load(colorAsset);
const doorAlpha = textureLoader.load(alphaAsset);
const doorAmbient = textureLoader.load(ambientAsset);
const doorHeight = textureLoader.load(heightAsset);
const doorNormal = textureLoader.load(normalAsset);
const doorMetalness = textureLoader.load(metalnessAsset);
const doorRoughness = textureLoader.load(roughnessAsset);
const matCap = textureLoader.load(matCapAsset);
const grad = textureLoader.load(gradientAsset);
// grad.minFilter = THREE.NearestFilter;
// grad.magFilter = THREE.NearestFilter;
// grad.generateMipmaps = false;

// Object
// const material = new THREE.MeshBasicMaterial({
//   map: doorColor,
//   alphaMap: doorAlpha,
//   side: THREE.DoubleSide,
//   wireframe: false,
//   opacity: 1,
//   transparent: true
// });
// const material = new THREE.MeshNormalMaterial({
//   flatShading: true
// });
// const material = new THREE.MeshMatcapMaterial({
//   matcap: matCap,
//   side: THREE.DoubleSide
// });
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial({
//   shininess: 90,
//   specular: new THREE.Color('red')
// });
// const material = new THREE.MeshToonMaterial({
//   gradientMap: grad,
// });
const material = new THREE.MeshStandardMaterial({
  metalness: 0.6,
  roughness: 0.5,
  map: doorColor,
  aoMap: doorAmbient,
  displacementMap: doorHeight,
  displacementScale: 0.05,
  metalnessMap: doorMetalness,
  roughnessMap: doorRoughness,
  normalMap: doorNormal,
  alphaMap: doorAlpha,
  transparent: true,
});
gui.add(material, 'metalness', 0, 1, 0.01).name('Metalness');
gui.add(material, 'roughness', 0, 1, 0.01).name('Roughness');
gui.add(material, 'aoMapIntensity', 0, 10, 0.01).name('AO Map intensity');
gui.add(material, 'wireframe').name('Wireframe');

// Lights
const ambientLight = new THREE.AmbientLight('white', 0.5);
const pointLight = new THREE.PointLight('white', 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.1, 64, 128), material);
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));

torus.position.x = 1.5;
sphere.position.x = -1.5;

// Camera
// last two values is camera's field of view to reduce rendering of far away objects
const camera = new THREE.PerspectiveCamera(85, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 4;

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = true;

// Renderer
scene.add(camera, sphere, plane, torus, ambientLight, pointLight);
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
// Set pixel ratio to render only between 1 - 2 for performant only on high densitity displays
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// Animation tick
const clock = new THREE.Clock();
gsap.ticker.add(() => {
  const elapsedTime = clock.getElapsedTime();

  sphere.rotation.y = 0.15 * elapsedTime;
  plane.rotation.y = 0.15 * elapsedTime;
  torus.rotation.y = 0.15 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  controls.update();
  renderer.render(scene, camera);
});
