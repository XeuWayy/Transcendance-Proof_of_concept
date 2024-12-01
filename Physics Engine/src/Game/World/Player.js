import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'

import Game from "../Game.js";

class Player {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.world = this.game.world
        this.physics = this.game.physics
        this.camera = this.game.camera.instance
        this.inputManager = this.game.camera.fpsCamera.inputManager

        this.setupPhysics()
    }

    setupPhysics() {
        const capsuleDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0, 0, 3)
            .setCcdEnabled(true)
            .lockRotations()

        this.rigidBody = this.physics.world.createRigidBody(capsuleDesc)

        const colliderDesc = RAPIER.ColliderDesc.capsule(0.6, 0.5)
            .setMass(80)
            .setRestitution(0)
            .setFriction(0.7)

        this.collider = this.physics.world.createCollider(colliderDesc, this.rigidBody)
    }


    update() {
        const movementInput = this.inputManager.getMovementInput()
        const forwardVelocity = movementInput.forward * 8
        const strafeVelocity = movementInput.strafe * 8

        const direction = new THREE.Vector3()
        this.camera.getWorldDirection(direction)
        direction.y = 0
        direction.normalize()

        const right = new THREE.Vector3()
        right.crossVectors(this.camera.up, direction).normalize()

        const forward = direction.multiplyScalar(forwardVelocity)
        const strafe = right.multiplyScalar(strafeVelocity)

        const translation = new THREE.Vector3()
        translation.add(forward)
        translation.add(strafe)

        const currentLinvel = this.rigidBody.linvel()

        if (currentLinvel) {
            translation.y = currentLinvel.y
        }

        this.rigidBody.setLinvel(translation, true)

        const position = this.rigidBody.translation()
        this.camera.position.set(position.x, position.y + 0.61, position.z)
    }
}

export default Player