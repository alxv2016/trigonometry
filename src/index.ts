import './scss/app.scss';
import * as THREE from 'three';

// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Positions
mesh.position.set(0.7, -0.6, 1);
mesh.scale.set(2, 0.5, 0.5);
// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// camera.position.y = 1;
// camera.position.x = 1;
scene.add(camera);

console.log(mesh.position.distanceTo(camera.position));

// Renderer
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
