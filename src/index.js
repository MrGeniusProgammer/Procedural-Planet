// import './style/main.css'
// import * as THREE from 'three'
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import Player from './javascript/Player';

// /**
//  * screen
//  */
// const screen = {};
// screen.width = window.innerWidth;
// screen.height = window.innerHeight;

// window.addEventListener('resize', () => {
//     // Save screen
//     screen.width = window.innerWidth;
//     screen.height = window.innerHeight;

//     // Update camera
//     camera.aspect = screen.width / screen.height;
//     camera.updateProjectionMatrix();

//     // Update renderer
//     renderer.setSize(screen.width, screen.height);
// });

// /**
//  * Environnements
//  */

// // Renderer
// const renderer = new THREE.WebGLRenderer({
//     canvas: document.querySelector('.webgl')
// });

// renderer.setClearColor(new THREE.Color(0xffffff), 0.8);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.setSize(screen.width, screen.height);

// // Scene
// const scene = new THREE.Scene();

// // Camera
// const camera = new THREE.PerspectiveCamera(75, screen.width / screen.height, 0.1, 1000);
// camera.position.z = 5;
// scene.add(camera);

// // Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

// // Test
// const cube = new Player({scene, width: 1, height: 1, length: 1});

// /**
//  * Loop
//  */
// const loop = () =>
// {
//     // Update
//     controls.update();
//     cube.update();
//     cube.draw();

//     // Render
//     renderer.render(scene, camera)

//     // Keep looping
//     window.requestAnimationFrame(loop)
// }

// loop();

import Main from "./javascript/Main";

let APP = null;
window.addEventListener("DOMContentLoaded", () => {
    APP = new Main();
});