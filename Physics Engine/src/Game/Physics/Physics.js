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

    createBox({ width, height, depth, position, type}) {
        if (!this.world) {
            return
        }

        const halfExtents = { x: width * 0.5, y: height * 0.5, z: depth * 0.5 }
        const colliderDesc = RAPIER.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z)
        let rigidBodyDesc
        if (type === 'fixed') {
            rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(position.x, position.y, position.z)
        } else {
            rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(position.x, position.y, position.z)
        }
        const rigidBody = this.world.createRigidBody(rigidBodyDesc)
        this.world.createCollider(colliderDesc, rigidBody)

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