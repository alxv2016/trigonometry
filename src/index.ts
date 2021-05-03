import './scss/app.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import RobotoBold from './assets/fonts/Roboto_Bold.json';
import colorAsset from './assets/door/color.jpg';
import alphaAsset from './assets/door/alpha.jpg';
import metalnessAsset from './assets/door/metalness.jpg';
import heightAsset from './assets/door/height.jpg';
import normalAsset from './assets/door/normal.jpg';
import roughnessAsset from './assets/door/roughness.jpg';
import ambientAsset from './assets/door/ambientOcclusion.jpg';
import checkboxAsset from './assets/minecraft.png';
import matCapAsset from './assets/matcaps/9.png';
import matCapAsset2 from './assets/matcaps/8.png';
import gradientAsset from './assets/gradients/3.jpg';

// Debug
const gui = new dat.GUI();
// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
// Sizes
const limit = 100;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

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
// Font
const fontLoader = new THREE.FontLoader();
const font = fontLoader.parse(RobotoBold);
const parameters = {
  font,
  size: 0.5,
  height: 0.2,
  curveSegments: 4,
  bevelEnabled: true,
  bevelThickness: 0.01,
  bevelSize: 0.02,
  bevelOffset: 0,
  bevelSegments: 6,
};
const textGeometry = new THREE.TextGeometry('Jane Shi', parameters);
textGeometry.center();
//Textures
const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load(matCapAsset);
const matCapTexture2 = textureLoader.load(matCapAsset2);

const textMaterial = new THREE.MeshMatcapMaterial({matcap: matCapTexture});
const text = new THREE.Mesh(textGeometry, textMaterial);

const donutGeometry = new THREE.TorusGeometry(0.3, 0.1, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matCapTexture2});

function randomPos() {
  return (Math.random() - 0.5) * 10;
}
function randomRotation() {
  return Math.random() * Math.PI;
}

for (let i = 0; i < limit; i++) {
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  donut.position.x = randomPos();
  donut.position.y = randomPos();
  donut.position.z = randomPos();
  donut.rotation.x = randomRotation();
  donut.rotation.y = randomRotation();
  const scale = Math.random();

  donut.scale.set(scale, scale, scale);

  scene.add(donut);
}

// Lights
const ambientLight = new THREE.AmbientLight('white', 0.5);
const pointLight = new THREE.PointLight('white', 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

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
scene.add(camera, ambientLight, pointLight, text);
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
// Set pixel ratio to render only between 1 - 2 for performant only on high densitity displays
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// Animation tick
const clock = new THREE.Clock();
gsap.ticker.add(() => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();
  renderer.render(scene, camera);
});
