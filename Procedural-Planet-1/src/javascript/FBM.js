import * as THREE from "three";
import PerlinNoise from "./PerlinNoise";

export default class {
    constructor(options) {
        const { seed, scale, persistance, lacunarity, octaves, redistribution, amplitude, frequency } = options;
        this._noise = new PerlinNoise(seed);
        this._scale = scale || 1;
        this._persistance = persistance || 0.5;
        this._lacunarity = lacunarity || 2;
        this._octaves = octaves || 6;
        this._redistribution = redistribution || 1;
        this._frequency = frequency || 1;
        this._amplitude = amplitude || 1;
    }

    get3(input) {
        let result = 1;
        let max = this._amplitude;

        let noiseFunction = this._noise.get3.bind(this._noise);

        for (let i = 0; i < this._octaves; i++) {
            const position = new THREE.Vector3(
                input.x * this._scale * this._frequency,
                input.y * this._scale * this._frequency,
                input.z * this._scale * this._frequency
            );

            const noiseVal = (noiseFunction(position) * 0.5) + 0.5;
            result += noiseVal * this._amplitude;

            this._frequency *= this._lacunarity;
            this._amplitude *= this._persistance;
            max += this._amplitude;
        }

        const redistributed = Math.pow(result, this._redistribution);
        return redistributed / max;
    }
}