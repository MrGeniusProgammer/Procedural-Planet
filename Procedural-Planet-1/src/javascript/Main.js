import "../style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GUI } from "three/examples/jsm/libs/dat.gui.module";
import Planet from "./Planet";

export default class {
    constructor() {
        this.screen = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this._Initialize();

        window.addEventListener("resize", () => {
            this._onWindowResize();
        });
    }

    _Initialize() {
        this._renderer = new THREE.WebGLRenderer({ canvas: document.querySelector(".webgl"), antialias: true });
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(this.screen.width, this.screen.height);
        this._renderer.shadowMap.enabled = true;
        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, this.screen.width / this.screen.height, 0.1, 1000);
        this._camera.position.z = 30;
        this._camera.position.y = 0;
        this._scene.add(this._camera);
        this._controls = new OrbitControls(this._camera, this._renderer.domElement);
        this._controls.update();

        const Light = new THREE.PointLight(0xffffff, 2, 0);
        Light.position.set(25, 10, 50);
        Light.castShadow = true;
        this._scene.add(Light);

        const Light2 = new THREE.AmbientLight(0xffffff, 0.2);
        this._scene.add(Light2);

        this._gui = new GUI();

        // let sphere = new Sphere({ scene: this._scene, gui: this._gui, details: 0, radius: 10 });
        let planet = new Planet(this._scene, this._gui, 10, 10);
        planet.Rebuild();

        const loop = () => {
            planet.Update();
            this._renderer.render(this._scene, this._camera);
            window.requestAnimationFrame(loop);
        }

        loop();
    }

    _onWindowResize() {
        this.screen.width = window.innerWidth;
        this.screen.height = window.innerHeight;

        this._camera.aspect = this.screen.width / this.screen.height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(this.screen.width, this.screen.height);
    }
}
