import * as THREE from "three";
import FBM from "./FBM";

export default class {
    constructor(resolution, radius, localUp, scene, color, wireframe, frequency, amplitude) {
        this._resolution = resolution;
        this._radius = radius;
        this._scene = scene;
        this._isWirframe = wireframe;
        this._frequency = frequency;
        this._amplitude = amplitude;
        this._color = color;

        this._localUp = localUp;
        this._axisA = new THREE.Vector3(localUp.y, localUp.z, localUp.x);
        this._axisB = new THREE.Vector3().crossVectors(this._localUp, this._axisA);
        this._geometry = new THREE.BufferGeometry();
    }

    _Start() {
        this._Initialize();
        this._plane = new THREE.Mesh(this._geometry, new THREE.MeshPhongMaterial({ color: this._color, wireframe: this._isWirframe }));
        this._scene.add(this._plane);
    }

    _OnPointUnitSphere(v) {
        // let noise = new FBM({
        //     frequency: this._frequency,
        //     amplitude: this._amplitude
        // });

        let x = v.x * Math.sqrt(1 - ((v.y * v.y) / 2) - ((v.z * v.z) / 2) + (((v.y * v.y) * (v.z * v.z)) / 3));
        let y = v.y * Math.sqrt(1 - ((v.z * v.z) / 2) - ((v.x * v.x) / 2) + (((v.z * v.z) * (v.x * v.x)) / 3));
        let z = v.z * Math.sqrt(1 - ((v.x * v.x) / 2) - ((v.y * v.y) / 2) + (((v.x * v.x) * (v.y * v.y)) / 3));

        v.x = x;
        v.y = y;
        v.z = z;

        let value = 0;
        // value += noise.get3(v);
        v.multiplyScalar(this._radius * (1 + value));
    }

    _Initialize() {
        this._positions = [];
        this._normals = [];
        this._indices = [];
        this._uvs = [];

        let xPercent;
        let yPercent;
        let triIndex = 0;
        let i = 0;

        for (let y = 0; y < this._resolution; y++) {
            for (let x = 0; x < this._resolution; x++) {
                i = x + (y * this._resolution);

                xPercent = x / (this._resolution - 1);
                yPercent = y / (this._resolution - 1);

                let _P = new THREE.Vector3();
                let _C = new THREE.Vector3();
                let _A = new THREE.Vector3(this._axisA.x, this._axisA.y, this._axisA.z).multiplyScalar(2 * (xPercent - 0.5));
                let _B = new THREE.Vector3(this._axisB.x, this._axisB.y, this._axisB.z).multiplyScalar(2 * (yPercent - 0.5));
                
                _C.addVectors(this._localUp, _A);
                _P.addVectors(_C, _B);
                this._OnPointUnitSphere(_P, this._radius);
            
                this._positions.push(_P.x, _P.y, _P.z);
                this._normals.push(_P.x, _P.y, _P.z);
                this._uvs.push(_P.x / 10, _P.y / 10);

                if (x != (this._resolution - 1) && y != (this._resolution - 1)) {
                    const a = i;
                    const b = i + 1;
                    const c = i + this._resolution;
                    const d = i + this._resolution + 1;

                    // a - - b
                    // |     |
                    // |     |
                    // c - - d

                    this._indices[triIndex] = a;
                    this._indices[triIndex + 1] = b;
                    this._indices[triIndex + 2] = d;

                    this._indices[triIndex + 3] = a;
                    this._indices[triIndex + 4] = d;
                    this._indices[triIndex + 5] = c;
                    triIndex += 6;
                }
            }
        }

        this._geometry.setIndex(this._indices);
        this._geometry.setAttribute("position", new THREE.Float32BufferAttribute(this._positions, 3));
        this._geometry.setAttribute("normal", new THREE.Float32BufferAttribute(this._normals, 3));
        this._geometry.setAttribute("uv", new THREE.Float32BufferAttribute(this._uvs, 2));
    }
}
