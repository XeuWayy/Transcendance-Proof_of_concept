import * as THREE from "three/webgpu"
import * as RAPIER from "@dimforge/rapier3d"
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

import Game from "../Game.js"

class Physics {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.time = this.game.time

        this.initPhysics()
        this.enabled = true
        this.game.gui.add(this, 'enabled')
    }

    async initPhysics() {
        import('@dimforge/rapier3d').then(RAPIER => {
            const gravity = { x: 0.0, y: -9.81, z: 0.0 }
            this.world = new RAPIER.World(gravity)

            this.geometry = new THREE.BufferGeometry()
            this.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
            this.geometry.setAttribute('color', new THREE.Float32BufferAttribute([], 4))

            this.material = new THREE.LineBasicNodeMaterial({vertexColors: true})

            this.lineSegments = new THREE.LineSegments(this.geometry, this.material)
            this.lineSegments.frustumCulled = false

            this.scene.add(this.lineSegments)
        })
    }

    extractThreeGeometry(threeObject) {
        const geometries = []

        threeObject.traverse((child) => {
            if (child.isMesh && child.geometry) {
                geometries.push(child.geometry)
            }
        })
        const merged = BufferGeometryUtils.mergeGeometries(geometries)

        return {
            positions: new Float32Array(merged.attributes.position.array),
            indices: new Uint32Array(merged.index.array)
        };
    }

    createPhysics({name, colliderType, threeObject, type, mass, friction, restitution, interact}) {
        if (!this.world) {
            return
        }

        const position = threeObject.position
        const quaternion = threeObject.quaternion

        const boundingBox = new THREE.Box3().setFromObject(threeObject)
        const center = new THREE.Vector3()
        boundingBox.getCenter(center)

        const offset = center.sub(threeObject.position)

        let colliderDesc

        if (colliderType === 'convexHull' || colliderType === 'trimesh') {
            const data = this.extractThreeGeometry(threeObject)

            switch (colliderType) {
                case 'convexHull':
                    colliderDesc = RAPIER.ColliderDesc.convexHull(data.positions)
                        .setMass(mass)
                        .setFriction(friction)
                        .setRestitution(restitution);
                    break;
                case 'trimesh':
                    colliderDesc = RAPIER.ColliderDesc.trimesh(data.positions, data.indices)
                        .setMass(mass)
                        .setFriction(friction)
                        .setRestitution(restitution);
                    break;
            }
        } else {
            const threeObjectBox = new THREE.Box3().setFromObject(threeObject);
            const threeObjectVector = new THREE.Vector3();
            threeObjectBox.getSize(threeObjectVector);

            switch (colliderType) {
                case 'box':
                    colliderDesc = RAPIER.ColliderDesc.cuboid(threeObjectVector.x * 0.5, threeObjectVector.y * 0.5, threeObjectVector.z * 0.5)
                        .setTranslation(offset.x, offset.y, offset.z)
                        .setMass(mass)
                        .setFriction(friction)
                        .setRestitution(restitution);
                    break;
                case 'cylinder':
                    colliderDesc = RAPIER.ColliderDesc.cylinder(threeObjectVector.y * 0.5, threeObjectVector.x * 0.5)
                        .setTranslation(offset.x, offset.y, offset.z)
                        .setMass(mass)
                        .setFriction(friction)
                        .setRestitution(restitution);
                    break;
                case 'sphere':
                    colliderDesc = RAPIER.ColliderDesc.ball(threeObjectVector.x * 0.5)
                        .setTranslation(offset.x, offset.y, offset.z)
                        .setMass(mass)
                        .setFriction(friction)
                        .setRestitution(restitution);
                    break;
            }
        }

        let rigidBodyDesc;
        if (type === 'fixed') {
            rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(position.x, position.y, position.z);
        } else {
            rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(position.x, position.y, position.z)
                .setRotation(new RAPIER.Quaternion(
                    quaternion.x,
                    quaternion.y,
                    quaternion.z,
                    quaternion.w
                ));
        }

        const rigidBody = this.world.createRigidBody(rigidBodyDesc);
        const collider = this.world.createCollider(colliderDesc, rigidBody);

        interact.rapierCollider = collider;
        if (type === 'fixed') {
            this.game.world.addFixedObject(name, threeObject, rigidBody, interact);
        } else {
            this.game.world.addDynamicObject(name, threeObject, rigidBody, interact);
        }

        return rigidBody;
    }


    update() {
        if (this.world) {
            this.world.timestep = this.time.deltaInSecond
            this.world.step()

            if (this.enabled) {
                const { vertices, colors } = this.world.debugRender()

                this.geometry.attributes.position.array = vertices
                this.geometry.attributes.position.count = vertices.length / 3
                this.geometry.attributes.position.needsUpdate = true

                this.geometry.attributes.color.array = colors
                this.geometry.attributes.color.count = colors.length / 4
                this.geometry.attributes.color.needsUpdate = true

                this.lineSegments.visible = true
            } else {
                this.lineSegments.visible = false
            }

        }
    }
}

export default Physics