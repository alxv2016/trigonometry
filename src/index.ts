import './scss/app.scss';
import * as THREE from 'three';

// Canvas
const canvas: HTMLCanvasElement = document.querySelector('canvas.webgl');
// Sizes
const sizes = {
  width: 800,
  height: 600,
};
// Scene
const scene = new THREE.Scene();
// Groups
const group = new THREE.Group();
group.position.y = 1;
scene.add(group);

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0x0ff000}));
cube2.position.x = -2;

const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
cube3.position.x = 2;

group.add(cube1);
group.add(cube2);
group.add(cube3);

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({color: 0xff0000});
// const mesh = new THREE.Mesh(geometry, material);
// scene.add(mesh);

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
// camera.position.y = 1;
// camera.position.x = 1;
scene.add(camera);

// camera.lookAt(mesh.position)

// Renderer
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
