import * as THREE from "three";
export default class {
    constructor(_options) {
        this._scene = _options.scene;

        this.width = _options.width;
        this.height = _options.height;
        this.length = _options.length;

        this._gameWidth = 100;
        this._gameHeight = 200;
        this._gameLength = 100;
        this._damping = 0.99;

        this.cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(this.width, this.height, this.length),
            new THREE.MeshNormalMaterial(),
        );
        this._scene.add(this.cube);

        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(0, 0, 0);
    }

    update() {
        let speed = 0.0001;
        window.addEventListener("keydown", (e) => {
            if (e.key == "a") {
                this.acceleration.x -= speed;
            } else if (e.key == "d") {
                this.acceleration.x += speed;
            }

            if (e.key == "w") {
                this.acceleration.z -= speed;
            } else if (e.key == "s") {
                this.acceleration.z += speed;
            }
        });

        this.velocity.add(this.acceleration);
        this.velocity.multiplyScalar(this._damping);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0, 0);

        if (this.position.z > this._gameWidth) {
            this.position.z = -this._gameWidth;
        }

        if (this.position.z < -this._gameWidth) {
            this.position.z = this._gameWidth;
        }

        if (this.position.x > this._gameLength) {
            this.position.x = -this._gameLength;
        }

        if (this.position.x < -this._gameLength) {
            this.position.x = this._gameLength;
        }
    }

    draw() {
        this.cube.position.set(this.position.x, this.position.y, this.position.z);
    }
}
