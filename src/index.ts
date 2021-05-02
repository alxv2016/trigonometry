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

interface DocumentFullScreen extends HTMLDocument {
  webkitFullscreenElement?: Element;
}
// Debug
const debugUi = new dat.GUI();
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, {
      y: mesh.rotation.y + Math.PI * 2,
    });
  },
};
debugUi
  .addColor(parameters, 'color')
  .name('Color')
  .onChange(() => material.color.set(parameters.color));
debugUi.add(parameters, 'spin').name('Spin');
// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
// Sizes
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
// Toggle fullscreen
window.addEventListener('dblclick', () => {
  const webkitDoc = document as DocumentFullScreen;
  !document.fullscreenElement ? canvas.requestFullscreen() : document.exitFullscreen();
  //!webkitDoc.webkitFullscreenElement ? canvas.requestFullscreen() : document.exitFullscreen();
});
// Scene
const scene = new THREE.Scene();
// Groups
// const group = new THREE.Group();
// scene.add(group);

// const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));

// const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x0ff000}));
// cube2.position.x = -2;

// const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
// cube3.position.x = 2;

// group.add(cube1);
// group.add(cube2);
// group.add(cube3);

// Loading Management
const loadingManger = new THREE.LoadingManager();
loadingManger.onStart = () => console.log('loading');
loadingManger.onLoad = () => console.log('loaded');
const textureLoader = new THREE.TextureLoader(loadingManger);
// Textures
const colorTexture = textureLoader.load(colorAsset);
const alphaTexture = textureLoader.load(alphaAsset);
const normalTexture = textureLoader.load(normalAsset);
const metalTexture = textureLoader.load(metalnessAsset);
const heightTexture = textureLoader.load(heightAsset);
const ambientTexture = textureLoader.load(ambientAsset);
const roughnessTexture = textureLoader.load(roughnessAsset);
const checkboxTexture = textureLoader.load(checkboxAsset);

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({map: checkboxTexture, wireframe: false});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

console.log(geometry.attributes.uv);
// debug
debugUi.add(mesh.position, 'y', -3, 3, 0.01).name('Elevation');
debugUi.add(mesh.rotation, 'x', -3, 3, 0.01).name('Rotate X');
debugUi.add(mesh.rotation, 'y', -3, 3, 0.01).name('Rotate Y');
debugUi.add(mesh.material, 'wireframe').name('Show wires');

// Mipmapping
checkboxTexture.generateMipmaps = false;
checkboxTexture.minFilter = THREE.NearestFilter;
checkboxTexture.magFilter = THREE.NearestFilter;

// // Positions
// mesh.position.set(0.7, -0.6, 1);
// mesh.scale.set(2, 0.5, 0.5);

// mesh.rotation.reorder('YXZ');
// mesh.rotation.y = Math.PI * 0.25;
// mesh.rotation.x = Math.PI * 0.25;
// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Camera
// last two values is camera's field of view to reduce rendering of far away objects
const camera = new THREE.PerspectiveCamera(85, sizes.width / sizes.height, 0.1, 100);
const aspectRatio = sizes.width / sizes.height;
//const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.1 , 100)
camera.position.z = 2;
// camera.position.y = 2;
// camera.position.z = 2;
// console.log(camera.position.length())
//camera.lookAt(mesh.position);
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;

// Renderer
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
// Set pixel ratio to render only between 1 - 2 for performant only on high densitity displays
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// Animations
const clock = new THREE.Clock();
// gsap.to(mesh.rotation, {
//   duration: 4,
//   ease: 'none',
//   y: Math.PI * 2,
//   repeat: -1,
// });
gsap.ticker.add(() => {
  const elapsedTime = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
});

// tick();
