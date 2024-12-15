import * as THREE from "three/webgpu"
import * as RAPIER from "@dimforge/rapier3d";

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

    createBox({name, threeObject, type, mass, friction, restitution, interact}) {
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
        const collider = this.world.createCollider(colliderDesc, rigidBody)

        interact.rapierCollider = collider
        if (type === 'fixed') {
            this.game.world.addFixedObject(name, threeObject, rigidBody, interact)
        } else {
            this.game.world.addDynamicObject(name, threeObject, rigidBody, interact)
        }

        return rigidBody
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