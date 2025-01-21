import * as THREE from "three/webgpu";
import * as RAPIER from "@dimforge/rapier3d";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'

import Game from "../Game.js";

class Physics {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.time = this.game.time

        this.initPhysics()

        this.enabled = false
        this.setDebug()
    }

    setDebug() {
        this.physicsDebug = this.game.gui.addFolder({title: "🍃 - Physics Debug", expanded: false})

        this.physicsDebug.addBinding(this, 'enabled', {label: "Collider representation"})
    }

    async initPhysics() {
        import('@dimforge/rapier3d').then(RAPIER => {
            const gravity = { x: 0.0, y: -9.81, z: 0.0 }
            this.instance = new RAPIER.World(gravity)

            this.geometry = new THREE.BufferGeometry()
            this.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
            this.geometry.setAttribute('color', new THREE.Float32BufferAttribute([], 4))

            this.material = new THREE.LineBasicNodeMaterial({vertexColors: true})

            this.lineSegments = new THREE.LineSegments(this.geometry, this.material)
            this.lineSegments.frustumCulled = false

            //this.scene.add(this.lineSegments)
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
        if (!this.instance) {
            return
        }

        const position = threeObject.position
        const quaternion = threeObject.quaternion

        let lod
        if (threeObject.isLOD) {
            lod = threeObject
            threeObject = threeObject.children[0]
        }

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
            const threeObjectBox = new THREE.Box3().setFromObject(threeObject, true);
            const threeObjectVector = new THREE.Vector3();
            threeObjectBox.getSize(threeObjectVector);

            const center = new THREE.Vector3()
            threeObjectBox.getCenter(center)

            const offset = center.sub(threeObject.position)

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
            rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(position.x, position.y, position.z)
                .setRotation(new RAPIER.Quaternion(
                    quaternion.x,
                    quaternion.y,
                    quaternion.z,
                    quaternion.w
                ));
        } else {
            rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(position.x, position.y, position.z)
                .setRotation(new RAPIER.Quaternion(
                    quaternion.x,
                    quaternion.y,
                    quaternion.z,
                    quaternion.w
                ));
        }

        const rigidBody = this.instance.createRigidBody(rigidBodyDesc);
        interact.rapierCollider = this.instance.createCollider(colliderDesc, rigidBody)

        if (lod) {
            threeObject = lod
        }

        if (type === 'fixed') {
            this.game.world.addFixedObject(name, threeObject, rigidBody, interact)
        } else {
            this.game.world.addDynamicObject(name, threeObject, rigidBody, interact)
        }
    }


    async update() {
        if (this.instance) {
            this.instance.timestep = Math.min(this.time.deltaInSecond, 0.1)
            this.instance.step()

            if (this.enabled) {
                this.scene.add(this.lineSegments)
                const { vertices, colors } = this.instance.debugRender()

                this.geometry.attributes.position.array = vertices
                this.geometry.attributes.position.count = vertices.length / 3
                this.geometry.attributes.position.needsUpdate = true

                this.geometry.attributes.color.array = colors
                this.geometry.attributes.color.count = colors.length * 0.25
                this.geometry.attributes.color.needsUpdate = true

                this.lineSegments.visible = true
            } else {
                this.lineSegments.visible = false
            }
        }
    }

    cleanup() {
        if (this.physicsDebug) {
            this.physicsDebug.dispose()
        }

        if (this.instance) {
            this.instance.forEachCollider((collider) => {
                this.instance.removeCollider(collider, false)
            })
            this.instance.forEachRigidBody((body) => {
                this.instance.removeRigidBody(body)
            })

            this.instance.free()
        }
        if (this.geometry) {
            this.geometry.dispose()
        }

        for (const properties in this) {
            this[properties] = null
        }
    }
}

export default Physics