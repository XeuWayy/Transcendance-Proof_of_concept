import * as THREE from 'three/webgpu'
import * as RAPIER from '@dimforge/rapier3d'

import Game from "../Game.js"

class Player {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.physics = this.game.physics
        this.camera = this.game.camera.instance
        this.fpsCamera = this.game.camera.fpsCamera
        this.inputManager = this.game.camera.fpsCamera.inputManager
        this.interactManager = this.inputManager.interactManager

        this.cameraControlEnabled = true

        this.rayInformation = {
            rayDirection: new THREE.Vector3(0, -1, 0),
            rayLength: 1.10
        }

        this.playerSpeed = 8
        this.playerCrouched = false
        this.jumpCount = 0
        this.maxJumps = 2

        this.cameraHeight = 1.7
        this.playerHeight = 1.0488626956939697

        this.direction = new THREE.Vector3()
        this.right = new THREE.Vector3()
        this.forward = new THREE.Vector3()
        this.strafe = new THREE.Vector3()
        this.translation = new THREE.Vector3()

        this.setupPhysics()
        this.setupDebug()
    }

    setupDebug() {
        this.debugObject = this.game.debugObject

        this.playerDebug = this.game.gui.addFolder({title: "🤖 - Player debug", expanded: true})

        this.debugObject.cameraPosition = this.camera.position

        this.playerDebug.addBinding(this.debugObject, 'cameraPosition', {label: 'Camera Position', precision: 3})
    }

    setupPhysics() {
        const capsuleDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(5, 1.8, 0)
            .setCcdEnabled(true)
            .lockRotations()

        this.rigidBody = this.physics.instance.createRigidBody(capsuleDesc)

        const colliderDesc = RAPIER.ColliderDesc.capsule(0.55, 0.5)
            .setMass(0.75)
            .setRestitution(0.3)
            .setFriction(0.7)

        this.collider = this.physics.instance.createCollider(colliderDesc, this.rigidBody)
    }

    checkPlayerOnGround() {
        const rayOrigin = this.rigidBody.translation()
        const ray = new RAPIER.Ray(rayOrigin, this.rayInformation.rayDirection)

        this.onGround = false
        this.physics.instance.intersectionsWithRay(ray, this.rayInformation.rayLength, true, (collider) => {
            if (collider.collider.handle !== this.collider.handle) {
                this.onGround = true
            }
        })

        if (this.onGround) {
            this.jumpCount = 0
        }
    }

    update() {
        if (!this.cameraControlEnabled) {
            return
        }
        const movementInput = this.inputManager.getInputs()
        const forwardVelocity = movementInput.forward * this.playerSpeed
        const strafeVelocity = movementInput.strafe * this.playerSpeed
        const jumping = movementInput.jump
        const run = movementInput.run
        const crouch = movementInput.crouch

        this.checkPlayerOnGround()

        if (jumping.pressed) {
            if (this.onGround || this.jumpCount < this.maxJumps) {
                this.rigidBody.applyImpulse(new THREE.Vector3(0, 4, 0), true)
                this.jumpCount++
            }
        }

        if (run.pressed) {
            this.playerSpeed *= 2
        } else if (run.released) {
            this.playerSpeed *= 0.5
        }

        if (crouch.pressed) {
            if (!this.playerCrouched) {
                this.playerCrouched = true
                this.collider.setHalfHeight(0.3)
                this.cameraHeight = 1.1
                this.playerHeight = 0.7988615036010742
                this.playerSpeed *= 0.5
                this.fpsCamera.verticalBobbingFrequency *= 0.5
                this.fpsCamera.verticalBobbingAmplitude *= 0.5
            } else {
                this.playerCrouched = false
                this.collider.setHalfHeight(0.55)
                this.cameraHeight = 1.7
                this.playerHeight = 1.0488626956939697
                this.playerSpeed *= 2
                this.fpsCamera.verticalBobbingFrequency *= 2
                this.fpsCamera.verticalBobbingAmplitude *= 2
                this.rigidBody.applyImpulse(new THREE.Vector3(0, 0.2, 0), true)
            }
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
        const headBobbingOffset = this.fpsCamera.getHeadBobbingOffset()

        this.camera.position.set(
            position.x,
            (position.y - this.playerHeight) + this.cameraHeight + headBobbingOffset.vertical,
            position.z
        )

        const rightVector = new THREE.Vector3(1, 0, 0)
        rightVector.applyQuaternion(this.camera.quaternion)
        this.camera.position.add(
            rightVector.multiplyScalar(headBobbingOffset.horizontal)
        )

        this.camera.lookAt(this.fpsCamera.focusTarget())
        this.interactManager.updateTakenObject()
        this.playerDebug.refresh()
    }
}

export default Player