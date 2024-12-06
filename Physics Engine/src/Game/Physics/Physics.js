import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d";

import Game from "../Game.js"

class Physics {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene

        this.initPhysics()
        this.enabled = true
        this.game.gui.add(this, 'enabled')
    }

    async initPhysics() {
        import('@dimforge/rapier3d').then(RAPIER => {
            const gravity = { x: 0.0, y: -9.81, z: 0.0 }
            this.world = new RAPIER.World(gravity)
            console.log('ready');

            this.mesh = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: true }))
            this.mesh.frustumCulled = false
            this.scene.add(this.mesh)
        })
    }

    createBox({name, threeObject, type, mass, friction, restitution, offset}) {
        if (!this.world) {
            return
        }

        const threeObjectBox = new THREE.Box3().setFromObject(threeObject)
        const threeObjectVector = new THREE.Vector3()
        threeObjectBox.getSize(threeObjectVector)

        const position = threeObject.position
        const quaternion = threeObject.quaternion

        const colliderDesc = RAPIER.ColliderDesc.cuboid(threeObjectVector.x * 0.5, threeObjectVector.y * 0.5, threeObjectVector.z * 0.5)
            .setMass(mass)
            .setFriction(friction)
            .setRestitution(restitution)

        let rigidBodyDesc
        if (type === 'fixed') {
            rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(position.x, position.y, position.z)
        } else {
            rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(position.x, position.y, position.z)
                .setRotation(new RAPIER.Quaternion(
                    quaternion.x,
                    quaternion.y,
                    quaternion.z,
                    quaternion.w
                ))
        }
        const rigidBody = this.world.createRigidBody(rigidBodyDesc)
        this.world.createCollider(colliderDesc, rigidBody)

        if (type === 'fixed') {
            this.game.world.addFixedObject(name, threeObject, rigidBody, offset)
        } else {
            this.game.world.addDynamicObject(name, threeObject, rigidBody, offset)
        }

        return rigidBody
    }

    update() {
        if (this.world) {
            this.world.step()

            if (this.enabled) {
                const { vertices, colors } = this.world.debugRender()
                this.mesh.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
                this.mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
                this.mesh.visible = true
            } else {
                this.mesh.visible = false
            }

        }
    }
}

export default Physics