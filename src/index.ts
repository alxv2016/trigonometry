import './scss/app.scss';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
const ControlKit = require('controlkit');
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
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshNormalMaterial();
const group = new THREE.Group();

class Wave {
  constructor(public base: number, public offset: number, public total: number, public amp: number) {
    (this.base = base), (this.offset = offset), (this.total = total), (this.amp = amp);
  }
  getTotal() {
    return this.total;
  }
  calculate(x: number, y: number, time: number) {
    const dx = Math.cos((x / this.total) * (Math.PI * 2)) / 2;
    const dy = Math.cos((y / this.total) * (Math.PI * 2)) / 2;
    const theta = -(dx + dy) * this.amp;
    return this.base + Math.sin(time * this.amp + theta) * this.offset;
  }
}

const total = 40;

// for (let i = 0; i < total; i++) {
//   const slice = Math.PI * 2 / (total / 2);
//   const cylinder = new THREE.Mesh(geometry, material);
//   cylinder.position.x = Math.cos(i * slice) * total / 2;
//   cylinder.position.y = Math.sin(i * slice) * total / 2;
//   group.add(cylinder);
// }

for (let r = 4; r < total; r += 6) {
  const slice = (Math.PI * 2) / r;
  for (let i = 0; i < total; i++) {
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.x = Math.cos(i * slice) * r;
    cylinder.position.y = Math.sin(i * slice) * r;
    group.add(cylinder);
  }
}

// for (let i = 0; i < total; i++) {
//   const cylinder = new THREE.Mesh(geometry, material);
//   cylinder.position.x = Math.cos(i * slice) * radius;
//   cylinder.position.y = Math.sin(i * slice) * radius;
//   group.add(cylinder);
// }

console.log(group.children.length);

function sineWaveScale(fps: number) {
  for (let r = 4; r < total; r += 6) {
    const slice = (Math.PI * 2) / r;
    const radial = total + (Math.sin(fps) * total) / 2;
    for (let i = 0; i < group.children.length; i++) {
      group.children[i].position.x = Math.cos(i * slice) * radial;
      group.children[i].position.y = Math.sin(i * slice) * radial;
    }
  }
  // for (let i = 0; i < group.children.length; i++) {
  //   const slice = (Math.PI * 2) / total;
  //   const radial = total + Math.sin(fps) * total / 2;
  //   group.children[i].position.x = Math.cos(i / 2 * slice) * radial;
  //   group.children[i].position.y = Math.sin(i / 2 * slice) * radial;
  // }
}

// function sineWaveScale(fps: number) {
//   for (let i = 0; i < total; i++) {
//     const slice = Math.PI * 2 / (total / 2);
//     const radial = 20 + Math.sin(fps) * 10;
//     group.children[i].position.x = Math.cos(i * slice) * radial;
//     group.children[i].position.y = Math.sin(i * slice) * radial;
//   }
// }

const center = new THREE.Vector3();
new THREE.Box3().setFromObject(group).getCenter(center);
group.position.copy(center).multiplyScalar(-1);

// Add to scene
const axesHelper = new THREE.AxesHelper(5);
axesHelper.visible = false;
scene.add(axesHelper, group);
// Add camera and define it's Z axis and FOV
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 800);
camera.position.x = 90;
camera.position.y = 90;
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
