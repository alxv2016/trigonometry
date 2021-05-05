import './scss/app.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';
import * as dat from 'dat.gui';
import matCapAsset from './assets/matcaps/8.png';
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
// UI Debugger
const gui = new dat.GUI();
const colors = {
  specular: '#0f72fc',
};
// Init a THREE scene
const scene = new THREE.Scene();

// Load texture
const textureLoader = new THREE.TextureLoader();
const baseTexture = textureLoader.load(base);
const normalTexture = textureLoader.load(normal);
const roughnessTexture = textureLoader.load(roughness);
const dispTexture = textureLoader.load(disp);
const ambientTexture = textureLoader.load(ambient);

// Add geometries & material
const gem = new THREE.Mesh(
  new THREE.SphereGeometry(1, 100, 100),
  new THREE.MeshPhongMaterial({
    wireframe: false,
    map: baseTexture,
    aoMap: ambientTexture,
    normalMap: normalTexture,
    shininess: 64,
    reflectivity: 0.2,
    specular: colors.specular,
    bumpMap: roughnessTexture,
    bumpScale: 0.1,
    displacementMap: dispTexture,
    displacementScale: 0.12,
    displacementBias: 0.2,
  })
);
gem.geometry.setAttribute('uv2', new THREE.BufferAttribute(gem.geometry.attributes.uv.array, 2));
gui.add(gem.material, 'wireframe').name('Wireframe');
gui.add(gem.material, 'shininess', 0, 100, 1).name('Shininess');
gui.add(gem.material, 'reflectivity', 0, 1, 0.01).name('Reflections');
gui.add(gem.material, 'bumpScale', 0, 1, 0.01).name('Bumps');
gui.add(gem.material, 'displacementScale', 0, 1, 0.01).name('Displacements');
gui.add(gem.material, 'displacementBias', 0, 1, 0.01).name('Displacements bias');
gui
  .addColor(colors, 'specular')
  .name('Specular hue')
  .onChange(() => {
    gem.material.specular.set(colors.specular);
  });

// Lights
const ambientLight = new THREE.AmbientLight('white', 0.5);
const pointLight = new THREE.PointLight('white', 0.7);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

// Add to scene
scene.add(ambientLight, pointLight, gem);
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 100);
camera.position.z = 6;
// Render scene & camera
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
//const clock = new THREE.Clock()

gsap.ticker.add((time) => {
  gem.rotation.x = Math.cos(time / 2);
  gem.rotation.y = Math.sin(time / 2);
  // camera.lookAt(mesh.position);
  renderer.render(scene, camera);
});
