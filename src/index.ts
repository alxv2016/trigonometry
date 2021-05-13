import './scss/app.scss';
import * as THREE from 'three';
import {gsap} from 'gsap';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import matcap from './assets/matcaps/9.png';

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

// Textures
const textureLoader = new THREE.TextureLoader();
const matCapTexture = textureLoader.load(matcap);

// Add geometries & material
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.Mesh(geometry, material);
const group = new THREE.Group();

class Wave {
  constructor(public amp: number, public period: number, public phase: number) {
    this.amp = amp;
    this.period = period;
    this.phase = phase;
  }
  evaluate(x: number) {
    return Math.sin(this.phase + (Math.PI * 2 * x) / this.period) * this.amp;
  }
  update(x: number) {
    this.phase += x;
  }
}

// let radius = 2;
// let xRad = 4;
// const yRad = 4;
// let xspeed = 0.0025;
// let yspeed = 0.0025;
// let xangle = 0;
// let yangle = 0;
const total = 20;
const slice = (Math.PI * 2) / total;

let angles: any = [];
// // let angleV = 0.05;
let angleV: any = [];
// let radius = 2;
// let offset = 8;
// let total = 40;
// let cur: any = [];

for (let i = 0; i < total; i++) {
  angles[i] = i / 6;
}

// let waves: any = [];

// let wave = new Wave(2, 8, 0.001);
// function random(min: number, max: number) {
//   return Math.random() * (max - min) + min;
// }

// for (let i = 0; i < 5; i++) {
//   waves[i] = new Wave(random(0, 8), random(0, 8), random(1, 2));
// }

for (let i = 0; i < total; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = Math.cos(slice * i) * 30;
  mesh.position.y = Math.sin(slice * i) * 30;
  group.add(mesh);
}

const center = new THREE.Vector3();
new THREE.Box3().setFromObject(group).getCenter(center);
group.position.copy(center).multiplyScalar(-1);

const axesHelper = new THREE.AxesHelper(5);
axesHelper.visible = true;

// Add to scene
scene.add(axesHelper, group);
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 800);
camera.position.z = 95;

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
  // COS SIN Y
  // const y = base + Math.sin(yangle += yspeed) * yRad;
  // const x = base + Math.sin(yangle += yspeed) * yRad;
  // Lissagjous Curve
  // const y = base + Math.sin(yangle += yspeed) * yRad;
  // const x = base + Math.cos(xangle += xspeed) * xRad;
  // mesh.position.x = x;
  //mesh.position.x = x;
  // group.children.forEach((m, i) => {
  //   const x = base + Math.cos(xangle += xspeed) * xRad;
  //   const y = base + Math.cos(yangle += xspeed) * yRad;
  //   //m.position.x += x / 70;
  //   m.position.y += y / 20;
  // group.children.forEach((c, i) => {
  //   c.position.y = wave.evaluate(i);
  // });
  // })

  group.children.forEach((m, i) => {
    m.position.x = Math.cos(slice * i) * Math.cos(angles[i] + 0.8) * 10;
    m.position.y = Math.sin(slice * i) * Math.cos(angles[i] + 0.8) * 10;
    //wave.update(0.001);
    angles[i] += 0.02;
  });

  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(tick);
};

tick();
