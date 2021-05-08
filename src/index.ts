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

// Add geometries & material
const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshNormalMaterial();
const cube1 = new THREE.Mesh(geometry, material);
const group = new THREE.Group();
const grid = 4;
for (let i = 0; i < grid; i++) {
  for (let j = 0; j < grid; j++) {
    for (let k = 0; k < grid; k++) {
      const cube = new THREE.Mesh(geometry, material);
      cube.position.x = i * 0.4;
      cube.position.y = j * 0.4;
      cube.position.z = k * 0.4;
      group.add(cube);
    }
  }
}

const center = new THREE.Vector3();
new THREE.Box3().setFromObject(group).getCenter(center);
group.position.copy(center).multiplyScalar(-1);

const axesHelper = new THREE.AxesHelper(5);

// Add to scene
scene.add(axesHelper, group);
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 100);
camera.position.z = 6;

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;

// Render scene & camera
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);
renderer.setClearColor('#01062D');

const clock = new THREE.Clock();

const childrens = group.children.map((child) => child.scale);
const rotations = group.children.map((child) => child.rotation);

console.log(gsap.ticker.time);
gsap.to(childrens, {
  y: 2,
  x: 2,
  z: 2,
  repeat: -1,
  yoyo: true,
  yoyoEase: true,
  ease: 'power3.inOut',
  duration: 3,
  stagger: {
    from: 'center',
    amount: 2.75,
  },
});

gsap.ticker.add((time) => {
  gsap.to(rotations, {
    y: Math.PI * time,
    x: Math.cos(time),
  });
  renderer.render(scene, camera);
  controls.update();
});

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   gsap.to(childrens, {
//     y: Math.sin(elapsedTime),
//     //z: Math.sin(2),
//     yoyo: true,
//     stagger: {
//       from: 'start',
//       amount: 1.25
//     },
//   })
//   renderer.render(scene, camera);
//   controls.update();
//   window.requestAnimationFrame(tick);
// };

// tick();
