import * as THREE from 'three/webgpu'

import InputManager from "../InputManager/InputManager.js"
import Game from "../Game/Game.js"

class FirstPersonCamera {
    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Construct a first person camera
     * @param camera The camera instance
     */
    constructor(camera) {
        this.camera = camera

        this.game = new Game()

        this.inputManager = new InputManager()
        this.interactManager = this.inputManager.interactManager

        this.phi = 0
        this.theta = 0
        this.quaternionX = new THREE.Quaternion()
        this.quaternionZ = new THREE.Quaternion()
        this.baseHeight = this.camera.position.y

        this.verticalBobbingAmplitude = 0.15
        this.verticalBobbingFrequency = 10

        this.horizontalBobbingAmplitude = 0.015
        this.horizontalBobbingFrequency = 5

        this.bobbingPhaseOffset = Math.PI / 2

        this.verticalHeadBobbingOffset = 0
        this.horizontalHeadBobbingOffset = 0
        this.transitionSpeed = 8

        this.loadPlayerClass()
    }

    async loadPlayerClass() {
        while (this.game.world === undefined || this.game.world.player === undefined) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }

        this.player  = this.game.world.player
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Calculate && update the camera rotation && position
     * @param deltaTime The deltaTime between the update
     */
    update (deltaTime) {
        if (this.player && this.player.cameraControlEnabled) {
            this.updateRotation()
            this.updateHeadBobbing(deltaTime)
        }
        this.inputManager.update()
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Calculate the rotation of camera based on the mouse input
     */
    updateRotation() {
        const lookInput = this.inputManager.getInputs()

        const horizontalRotation = lookInput.rotation.x
        const verticalRotation = lookInput.rotation.y

        this.phi += -horizontalRotation
        this.theta = THREE.MathUtils.clamp(
            this.theta + -verticalRotation, -Math.PI / 3, Math.PI / 3
        )

        this.quaternionX.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)
        this.quaternionZ.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta)

        const quaternion = new THREE.Quaternion()
        quaternion.multiply(this.quaternionX)
        quaternion.multiply(this.quaternionZ)

        this.camera.quaternion.copy(quaternion)
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Calculate small camera movement to simulate human head moving
     * @param deltaTime The deltaTime between the update
     */
    updateHeadBobbing(deltaTime) {
        if (this.headBobbingActive) {
            this.headBobbingTimer += deltaTime

            const verticalBob = Math.sin(this.headBobbingTimer * this.verticalBobbingFrequency) * this.verticalBobbingAmplitude
            const horizontalBob = Math.sin(
                this.headBobbingTimer * this.horizontalBobbingFrequency + this.bobbingPhaseOffset
            ) * this.horizontalBobbingAmplitude

            this.verticalHeadBobbingOffset += (verticalBob - this.verticalHeadBobbingOffset)
                * this.transitionSpeed * deltaTime
            this.horizontalHeadBobbingOffset += (horizontalBob - this.horizontalHeadBobbingOffset)
                * this.transitionSpeed * deltaTime
        } else {
            this.headBobbingTimer = 0
            this.verticalHeadBobbingOffset *= 0.9
            this.horizontalHeadBobbingOffset *= 0.9
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Return the current bobbing offset
     * @returns {{vertical: number, horizontal: number}} The current calculated bobbing value
     */
    getHeadBobbingOffset() {
        return {
            vertical: this.verticalHeadBobbingOffset,
            horizontal: this.horizontalHeadBobbingOffset
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Give an update look at position for the camera
     * @returns {THREE.Vector3} The look at position
     */
    focusTarget() {
        let pos = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z)

        let forward = new THREE.Vector3()
        this.camera.getWorldDirection(forward)
        forward.multiplyScalar(15)

        pos.add(forward)
        return pos
    }
}

export default FirstPersonCamera