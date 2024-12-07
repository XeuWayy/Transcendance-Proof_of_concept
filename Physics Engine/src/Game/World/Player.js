import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'

import Game from "../Game.js"

class Player {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.world = this.game.world
        this.physics = this.game.physics
        this.camera = this.game.camera.instance
        this.fpsCamera = this.game.camera.fpsCamera
        this.inputManager = this.game.camera.fpsCamera.inputManager

        this.rayInformation = {
            rayDirection: new THREE.Vector3(0, -1, 0),
            rayLength: 1.2
        }

        this.jumpCount = 0
        this.maxJumps = 2
        this.jumpPressed = false

        this.direction = new THREE.Vector3()
        this.right = new THREE.Vector3()
        this.forward = new THREE.Vector3()
        this.strafe = new THREE.Vector3()
        this.translation = new THREE.Vector3()

        this.setupPhysics()
    }

    setupPhysics() {
        const capsuleDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0, 150, 0)
            .setCcdEnabled(true)
            .lockRotations()

        this.rigidBody = this.physics.world.createRigidBody(capsuleDesc)

        const colliderDesc = RAPIER.ColliderDesc.capsule(0.6, 0.5)
            .setMass(0.75)
            .setRestitution(0.3)
            .setFriction(0.7)

        this.collider = this.physics.world.createCollider(colliderDesc, this.rigidBody)

    }

    checkPlayerOnGround() {
        const rayOrigin = this.rigidBody.translation()
        const ray = new RAPIER.Ray(rayOrigin, this.rayInformation.rayDirection)

        this.onGround = false
        this.physics.world.intersectionsWithRay(ray, this.rayInformation.rayLength, true, (collider) => {
            if (collider.collider.handle !== this.collider.handle) {
                this.onGround = true
            }
        })

        if (this.onGround) {
            this.jumpCount = 0
        }
    }

    update() {
        if (!this.fpsCamera.isInteractingWithArcade) {
            const movementInput = this.inputManager.getMovementInput()
            const forwardVelocity = movementInput.forward * 10
            const strafeVelocity = movementInput.strafe * 10
            const jumping = movementInput.jump

            this.checkPlayerOnGround()

            if (jumping && !this.jumpPressed) {
                if (this.onGround || this.jumpCount < this.maxJumps) {
                    this.rigidBody.applyImpulse(new THREE.Vector3(0, 5, 0), true)
                    this.jumpCount++
                }
                this.jumpPressed = true
            }

            if (!jumping) {
                this.jumpPressed = false
            }

            this.fpsCamera.headBobbingActive = this.onGround && (forwardVelocity !== 0 || strafeVelocity !== 0)

            this.camera.getWorldDirection(this.direction)
            this.direction.y = 0
            this.direction.normalize()

            this.right.crossVectors(this.camera.up, this.direction).normalize()

            const forward = this.direction.multiplyScalar(forwardVelocity)
            const strafe = this.right.multiplyScalar(strafeVelocity)

            this.translation = new THREE.Vector3()
            this.translation.add(forward)
            this.translation.add(strafe)

            const currentLinvel = this.rigidBody.linvel()

            if (currentLinvel) {
                this.translation.y = currentLinvel.y
            }

            this.rigidBody.setLinvel(this.translation, true)

            const position = this.rigidBody.translation()
            const oldy = this.camera.position.y
            this.camera.position.set(position.x, position.y - 1.09 + oldy, position.z)
            this.camera.lookAt(this.fpsCamera.focusTarget())
        }
    }

}

export default Player