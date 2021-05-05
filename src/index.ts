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
    specular: colors.specular,
    bumpMap: roughnessTexture,
    displacementMap: dispTexture,
    displacementScale: 0.12,
  })
);
gem.geometry.setAttribute('uv2', new THREE.BufferAttribute(gem.geometry.attributes.uv.array, 2));
gui.add(gem.material, 'wireframe').name('Wireframe');
gui.add(gem.material, 'shininess', 0, 100, 1).name('Shininess');
gui.add(gem.material, 'displacementScale', 0, 1, 0.01).name('Displacements');
gui
  .addColor(colors, 'specular')
  .name('Specular hue')
  .onChange(() => {
    gem.material.specular.set(colors.specular);
  });

// Lights
const ambientLight = new THREE.AmbientLight('white', 0.5);
const pointLight = new THREE.PointLight('white', 1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

// Fog
const fog = new THREE.Fog('#01062D', 1, 8);
scene.fog = fog;

// Add to scene
scene.add(ambientLight, pointLight, gem);
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 100);
camera.position.z = 6;
gui.add(camera.position, 'z', 0, 10, 0.01).name('Camera');
// Render scene & camera
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
renderer.setClearColor('#01062D');
//const clock = new THREE.Clock()

gsap.ticker.add((time) => {
  gem.rotation.x = Math.cos(time / 2);
  gem.rotation.y = Math.sin(time / 2);
  // camera.lookAt(mesh.position);
  renderer.render(scene, camera);
});
