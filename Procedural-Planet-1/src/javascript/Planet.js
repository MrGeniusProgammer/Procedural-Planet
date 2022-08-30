import * as THREE from "three";
import { CubeQuadTree } from "./QuadTree";
import TerrainFace from "./TerrainFace";

export default class {
    constructor(scene, gui, resolution, radius) {
        this._resolution = resolution;
        this._radius = radius;
        this._isWireframe = false;
        this._isUpdate = false;
        this._frequency = 1;
        this._amplitude = 1;

        this._gui = gui;
        this._scene = scene;

        this._settingOptions = {
            resolution: this._resolution,
            radius: this._radius,
            wireframe: this._isWireframe,
            frequency: this._frequency,
            amplitude: this._amplitude
        }

        const folder = this._gui.addFolder("Planet");
        folder.open();
        folder.add(this._settingOptions, "resolution", 2, 20, 1).onChange(value => { this._resolution = value; this._isUpdate = true; });
        folder.add(this._settingOptions, "radius", 2, 20, 1).onChange(value => { this._radius = value; this._isUpdate = true; });;
        folder.add(this._settingOptions, "frequency", 0, 200, 1).onChange(value => { this._frequency = value; this._isUpdate = true; });;
        folder.add(this._settingOptions, "amplitude", 0, 200, 1).onChange(value => { this._amplitude = value; this._isUpdate = true; });;
        folder.add(this._settingOptions, "wireframe").onChange(value => { this._isWireframe = value; this._isUpdate = true; });;
    }

    _Initialize() {
        this._terrainFaces = [];
        this._group = new THREE.Group();
        this._scene.add(this._group);

        let colors = [
            new THREE.Color(0xff0000),
            new THREE.Color(0xffff00),
            new THREE.Color(0xffffff),
            new THREE.Color(0x00ff00),
            new THREE.Color(0x00ffff),
            new THREE.Color(0x0000ff),
        ];
        
        let directions = [
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, -1, 0),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(-1, 0, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 0, -1),
        ];

        for (let i = 0; i < 6; i++) {
            this._terrainFaces[i] = new TerrainFace(
                this._resolution,
                this._radius,
                directions[i],
                this._group,
                colors[i],
                this._isWireframe,
                this._frequency,
                this._amplitude
            );
            
            this._terrainFaces[i]._Start();
        }
    }

    Update() {
        if (this._isUpdate) {
            this._Delete();
            this._Initialize();
            this._isUpdate = false;
        } else {
            this._group.rotateY(0.01);
            // this._group.rotateX(0.001);
        }
    }

    _Delete() {
        this._scene.remove(this._group);
    }

    Rebuild() {
        this._Initialize();
    }
}