import './scss/app.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {Mesh} from 'three';
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
const geometry = new THREE.CylinderGeometry(1, 1, 2, 64);
const material = new THREE.MeshNormalMaterial();
const cylinder = new THREE.Mesh(geometry, material);
const group = new THREE.Group();
let radius = 3;
let radius2 = 3;
let angle = 0;
let baseRadius = 6;
let offset = 4;
let velocity = 0;
let amplitude = 0;
let period = 0;
let total = 20;

for (let i = 0; i < total; i++) {
  for (let j = 0; j < total; j++) {
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.x = i * 2;
    cylinder.position.z = j * 2;
    group.add(cylinder);
  }
}

// for (let i = 0; i < total; i++) {
//   const cylinder = new THREE.Mesh(geometry, material);
//   cylinder.position.x = i * 4;
//   group.add(cylinder);
// }

console.log(group.children.length);

function sineWaveScale(fps: number) {
  // for (let i = 0; i < total; i++) {
  //     let speed = fps * 8;
  //     let y = baseRadius + Math.sin(speed + i * 2) * offset;
  //     group.children[i].scale.y = y;
  // }
  for (let i = 0; i < total; i++) {
    for (let j = 0; j < total; j++) {
      let x = Math.sin(i / (total / 2));
      let y = Math.sin(j / (total / 2));
      let disp = (x + y) * (x + y);
      let z = baseRadius + Math.sin(fps * 2 + disp) * offset;
      group.children[i + j * total].scale.y = z;
      group.children[i + j * total].position.y = z;
    }
  }
}

const center = new THREE.Vector3();
new THREE.Box3().setFromObject(group).getCenter(center);
group.position.copy(center).multiplyScalar(-1);

// function sineWaveY() {
//   radius = Math.sin(angle) * offset;
//   sphere.position.y = radius;
//   angle += velocity;
// }

// function angleRotation() {
//   sphere2.position.x = radius * Math.cos(angle) * offset;
//   sphere2.position.y = radius * Math.sin(angle) * offset;
//   sphere2.position.z = radius * Math.sin(angle) * offset;
//   radius = Math.cos(angle * Math.PI * 2) * 6;
//   angle -= 0.005;
// }

// Add to scene
const axesHelper = new THREE.AxesHelper(5);
axesHelper.visible = true;
scene.add(axesHelper, group);
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
  const fps = clock.getElapsedTime();
  sineWaveScale(fps);
  renderer.render(scene, camera);
  controls.update();
  window.requestAnimationFrame(tick);
};
tick();
