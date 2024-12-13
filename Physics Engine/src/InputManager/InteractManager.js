import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d"

import Game from "../Game/Game.js"

class InteractManager {
    constructor() {
        this.interactList = []
        this.currentlyInteracting = false
        this.currentObject = undefined

        this.objectCurrentPosition = new THREE.Vector3()
        this.load()
    }

    async load() {
        this.game = new Game()

        while (this.game.world === undefined) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        this.camera = this.game.camera
        this.cameraInstance = this.camera.instance
        this.inputManager = this.camera.fpsCamera.inputManager
        this.world = this.game.world
        this.time = this.game.time
    }

    stopInteraction() {
        this.currentlyInteracting = false

        if (this.currentObject.type === 'zoom') {
            this.inputManager.activeInputControlMode = 'moving'
            this.inputManager.updateMovingMode()
            this.currentObject.action()
            this.currentObject = undefined
            return
        }
        if (this.currentObject.type === 'take') {
            this.currentObject.rapierCollider.setEnabled(true)

            const playerLinvel = this.world.player.rigidBody.linvel()
            playerLinvel.x *= 1.15
            playerLinvel.z *= 1.15

            this.currentObject.rapierCollider.parent().setLinvel(playerLinvel, true)
            this.currentObject = undefined
        }
    }

    checkForInteraction() {
        if (this.currentlyInteracting) {
            this.currentlyInteracting = false
            this.stopInteraction()
            return
        }

        const rayOrigin = this.cameraInstance.position

        const rayDirection = this.cameraInstance.getWorldDirection(new THREE.Vector3())
        const rayLength = 2.5

        const ray = new RAPIER.Ray(rayOrigin, rayDirection)
        this.game.physics.world.intersectionsWithRay(ray, rayLength, true, (object) => {
            const find = this.interactList.find(interact => interact.rapierCollider.handle === object.collider.handle)
            
            if (find && !this.currentlyInteracting) {
                this.currentlyInteracting = true
                this.currentObject = find
                if (find.type === 'zoom') {
                    this.inputManager.activeInputControlMode = 'playingGame'
                    find.action()
                }

            }
        })

        if (this.currentlyInteracting && this.currentObject.type === 'take') {
            this.objectCurrentPosition = this.currentObject.threeMesh.position
            this.currentObject.rapierCollider.setEnabled(false)
        }
    }

    throwTakenObject() {
        this.currentlyInteracting = false
        const cameraPosition = this.cameraInstance.position

        const cameraDirection = this.cameraInstance.getWorldDirection(new THREE.Vector3()).normalize()

        const throwSpeed = 10
        const velocity = cameraDirection.clone().multiplyScalar(throwSpeed)

        const newPosition = new THREE.Vector3()
        .copy(cameraPosition)
        .add(cameraDirection.multiplyScalar(2))

        newPosition.y = cameraPosition.y

        this.currentObject.rapierCollider.setEnabled(true)
        this.currentObject.rapierCollider.parent().setTranslation(newPosition, true)
        this.currentObject.rapierCollider.parent().setLinvel(velocity, true)

        this.currentObject = undefined
    }

    updateTakenObject() {
        if (this.currentlyInteracting && this.currentObject.type === 'take') {
            const inputs = this.inputManager.getInputs()
            if (inputs.throw.pressed){
                this.throwTakenObject()
                return
            }

            const cameraPosition = this.cameraInstance.position
            const cameraDirection = this.cameraInstance.getWorldDirection(new THREE.Vector3())

            const rightVector = new THREE.Vector3()
            rightVector.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize()

            const forwardDistance = 2
            const rightOffset = 1.5

            const time = this.time.current * 0.001
            let levitationOffsetX = Math.sin(time) * 0.1
            let levitationOffsetY = Math.sin(time) * 0.12

            const newPosition = new THREE.Vector3()
                .copy(cameraPosition)
                .add(cameraDirection.multiplyScalar(forwardDistance))
                .add(rightVector.multiplyScalar(rightOffset + levitationOffsetX))

            newPosition.y = cameraPosition.y + levitationOffsetY

            const playerVelocity = this.world.player.rigidBody.linvel()
            const velocityMagnitude = Math.abs(playerVelocity.x) +
                Math.abs(playerVelocity.y) +
                Math.abs(playerVelocity.z)

            const lerpFactor = velocityMagnitude > 0.1 ? 0.34 : 0.05

            this.objectCurrentPosition.lerp(newPosition, lerpFactor)

            this.currentObject.rapierCollider.parent().setTranslation(this.objectCurrentPosition, true)

            const lookAtPos = new THREE.Vector3().copy(cameraPosition)
            lookAtPos.y = this.objectCurrentPosition.y

            const baseRotation = new THREE.Quaternion().setFromRotationMatrix(
                new THREE.Matrix4().lookAt(this.objectCurrentPosition, lookAtPos, new THREE.Vector3(0, 1, 0))
            )

            const rotationOffset = new THREE.Quaternion()
            rotationOffset.setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                Math.sin(time * 0.4) * 0.3
            )

            const finalRotation = baseRotation.multiply(rotationOffset)
            this.currentObject.rapierCollider.parent().setRotation(finalRotation)
        }
    }

    update() {
        const inputs = this.inputManager.getInputs()

        if (inputs && inputs.interact.pressed) {
            this.checkForInteraction()
        }
    }
}

export default InteractManager