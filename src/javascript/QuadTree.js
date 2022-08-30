import * as THREE from "three";

class CubeQuadTree {
    constructor(radius) {
        this._sides = [];

        this._radius = radius;
        let m;
        const transforms = [];

        // +Y
        m = new THREE.Matrix4();
        m.makeRotationX(-Math.PI / 2);
        // m.premultiply(new THREE.Matrix4().makeTranslation(0, this._radius, 0));
        transforms.push(m);

        // -Y
        m = new THREE.Matrix4();
        m.makeRotationX(Math.PI / 2);
        // m.premultiply(new THREE.Matrix4().makeTranslation(0, -this._radius, 0));
        transforms.push(m);

        // +X
        m = new THREE.Matrix4();
        m.makeRotationY(Math.PI / 2);
        // m.premultiply(new THREE.Matrix4().makeTranslation(this._radius, 0, 0));
        transforms.push(m);

        // -X
        m = new THREE.Matrix4();
        m.makeRotationY(-Math.PI / 2);
        // m.premultiply(new THREE.Matrix4().makeTranslation(-this._radius, 0, 0));
        transforms.push(m);

        // +Z
        m = new THREE.Matrix4();
        // m.premultiply(new THREE.Matrix4().makeTranslation(0, 0, this._radius));
        transforms.push(m);

        // -Z
        m = new THREE.Matrix4();
        m.makeRotationY(Math.PI);
        // m.premultiply(new THREE.Matrix4().makeTranslation(0, 0, -this._radius));
        transforms.push(m);

        for (let t of transforms) {
            this._sides.push({
                transform: t.clone(),
                worldToLocal: t.clone().getInverse(t),
                quadtree: new QuadTree(this._radius, t),
            });
        }
    }

    GetChildren() {
        const children = [];

        for (let s of this._sides) {
            const side = {
                transform: s.transform,
                children: s.quadtree.GetChildren(),
            };
            
            children.push(side);
        }
        return children;
    }

    Insert(pos) {
        for (let s of this._sides) {
            s.quadtree.Insert(pos);
        }
    }
}

class QuadTree {
    constructor(size, localToWorld) {
        this._size = size;
        // this._min_node_size = minNodeSize;
        this._loacalToWorld = localToWorld;

        const b = new THREE.Box3(
            new THREE.Vector3(-this._size, -this._size, 0),
            new THREE.Vector3(this._size, this._size, 0),
        );

        this._root = {
            bounds: b,
            children: [],
            center: b.getCenter(new THREE.Vector3()),
            sphereCenter: b.getCenter(new THREE.Vector3()),
            size: b.getSize(new THREE.Vector3()),
            root: true,
        };

        this._root.sphereCenter = this._root.center.clone();
        this._root.sphereCenter.applyMatrix4(this._loacalToWorld);
        this._root.sphereCenter.normalize();
        this._root.sphereCenter.multiplyScalar(this._size);
    }

    GetChildren() {
        const children = [];
        this._GetChildren(this._root, children);
        return children;
    }

    _GetChildren(node, target) {
        if (node.children.length == 0) {
            target.push(node);
            return;
        }

        for (let c of node.children) {
            this._GetChildren(c, target);
        }
    }

    // Insert(pos) {
    //     this._Insert(this._root, pos);
    // }

    // _Insert(child, pos) {
    //     const distToChild = this._DistanceToChild(child, pos);

    //     if (
    //         distToChild < child.size.x * 1.25 &&
    //         child.size.x > this._min_node_size
    //     ) {
    //         child.children = this._CreateChildren(child);

    //         for (let c of child.children) {
    //             this._Insert(c, pos);
    //         }
    //     }
    // }

    // _DistanceToChild(child, pos) {
    //     return child.sphereCenter.distanceTo(pos);
    // }

    _CreateChildren(child) {
        const midpoint = child.bounds.getCenter(new THREE.Vector3());

        // Bottom left
        const b1 = new THREE.Box3(child.bounds.min, midpoint);

        // Bottom right
        const b2 = new THREE.Box3(
            new THREE.Vector3(midpoint.x, child.bounds.min.y, 0),
            new THREE.Vector3(child.bounds.max.x, midpoint.y, 0),
        );

        // Top left
        const b3 = new THREE.Box3(
            new THREE.Vector3(child.bounds.min.x, midpoint.y, 0),
            new THREE.Vector3(midpoint.x, child.bounds.max.y, 0),
        );

        // Top right
        const b4 = new THREE.Box3(midpoint, child.bounds.max);

        const children = [b1, b2, b3, b4].map((b) => {
            return {
                bounds: b,
                children: [],
                center: b.getCenter(new THREE.Vector3()),
                size: b.getSize(new THREE.Vector3()),
            };
        });

        for (let c of children) {
            c.sphereCenter = c.center.clone();
            c.sphereCenter.applyMatrix4(this._localToWorld);
            c.sphereCenter.normalize();
            c.sphereCenter.multiplyScalar(this._size);
        }

        return children;
    }
}

export { CubeQuadTree, QuadTree };