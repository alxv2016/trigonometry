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
const group = new THREE.Group();

class Wave {
  constructor(public base: number, public offset: number, public total: number) {
    (this.base = base), (this.offset = offset), (this.total = total);
  }
  getTotal() {
    return this.total;
  }
  calculate(x: number, y: number, time: number) {
    let dx = Math.cos((x / this.total) * (Math.PI * 2)) / 2;
    let dy = Math.cos((y / this.total) * (Math.PI * 2)) / 2;
    let theta = -(dx + dy) * 3;
    return this.base + Math.sin(time * 4 + theta) * this.offset;
  }
}

const wave = new Wave(6, 5, 18);

for (let i = 0; i < wave.getTotal(); i++) {
  for (let j = 0; j < wave.getTotal(); j++) {
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.x = i * 2;
    cylinder.position.z = j * 2;
    group.add(cylinder);
  }
}

function sineWaveScale(fps: number) {
  for (let i = 0; i < wave.getTotal(); i++) {
    for (let j = 0; j < wave.getTotal(); j++) {
      group.children[i + j * wave.getTotal()].scale.y = wave.calculate(i, j, fps);
      //group.children[i + j * total].position.y = z;
    }
  }
}

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
