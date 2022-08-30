import * as THREE from "three";
import p from "./p";

export default class {
    constructor(seed) {
        const _gradientVecs = [
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(-1, 1, 0),
            new THREE.Vector3(1, -1, 0),
            new THREE.Vector3(-1, -1, 0),
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(-1, 0, 1),
            new THREE.Vector3(1, 0, -1),
            new THREE.Vector3(-1, 0, -1),
            new THREE.Vector3(0, 1, 1),
            new THREE.Vector3(0, -1, 1),
            new THREE.Vector3(0, 1, -1),
            new THREE.Vector3(0, -1, -1),
        ];

        var perm = new Array(512);
        var gradP = new Array(512);

        if (!seed) seed = 1;
        seed *= 65536;

        for (var i = 0; i < 256; i++) {
            var v;
            if (i & 1) {
                v = p[i] ^ (seed & 255);
            } else {
                v = p[i] ^ ((seed >> 8) & 255);
            }

            perm[i] = perm[i + 256] = v;
            gradP[i] = gradP[i + 256] = _gradientVecs[v % 12];
        }

        this._seed = seed;

        this._offsetMatrix = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 1),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 1, 1),
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(1, 0, 1),
            new THREE.Vector3(1, 1, 0),
            new THREE.Vector3(1, 1, 1),
        ];

        this.perm = perm;
        this.gradP = gradP;
    }

    _fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    _lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    _gradient(posInCell) {
        return posInCell.x + this.perm[posInCell.y + this.perm[posInCell.z]];
    }
    
    get3(input) {
        const cell = new THREE.Vector3(
            Math.floor(input.x),
            Math.floor(input.y),
            Math.floor(input.z)
        );

        input.sub(cell);

        cell.x &= 255;
        cell.y &= 255;
        cell.z &= 255;

        const gradiantDot = [];
        for (let i = 0; i < 8; i++) {
            const s = this._offsetMatrix[i];

            const grad3 = this.gradP[this._gradient(new THREE.Vector3().addVectors(cell, s))];
            const dist2 = new THREE.Vector3().subVectors(input, s);

            gradiantDot.push(grad3.dot(dist2));
        }

        const u = this._fade(input.x);
        const v = this._fade(input.y);
        const w = this._fade(input.z);

        const value = this._lerp(this._lerp(this._lerp(gradiantDot[0], gradiantDot[4], u), this._lerp(gradiantDot[1], gradiantDot[5], u), w), this._lerp(this._lerp(gradiantDot[2], gradiantDot[6], u), this._lerp(gradiantDot[3], gradiantDot[7], u), w), v);

        return value;
    }
}