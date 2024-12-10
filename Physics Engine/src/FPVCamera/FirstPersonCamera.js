import * as THREE from 'three'
import InputManager from "../InputManager/InputManager.js"

class FirstPersonCamera {
    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Construct a first person camera
     * @param cameraClass The Camera.js class
     */
    constructor(cameraClass) {
        this.camera = cameraClass.instance
        
        this.inputManager = new InputManager(cameraClass)

        this.isInteractingWithArcade = false

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

        this.currentVerticalOffset = 0
        this.currentHorizontalOffset = 0
        this.transitionSpeed = 8
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Calculate && update the camera rotation && position
     * @param deltaTime The deltaTime between the update
     */
    update (deltaTime) {
        if (!this.isInteractingWithArcade) {
            this.updateRotation()
            this.updateHeadBobbing(deltaTime)
            this.inputManager.update()
        }
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
     * @desc Implement small camera movement to simulate human head moving
     * @param deltaTime The deltaTime between the update
     */
    updateHeadBobbing(deltaTime) {
        if (this.headBobbingActive) {
            this.headBobbingTimer += deltaTime

            const verticalBob = Math.sin(this.headBobbingTimer * this.verticalBobbingFrequency) * this.verticalBobbingAmplitude

            const horizontalBob = Math.sin(
                this.headBobbingTimer * this.horizontalBobbingFrequency + this.bobbingPhaseOffset
            ) * this.horizontalBobbingAmplitude

            this.currentVerticalOffset += (verticalBob - this.currentVerticalOffset)
                * this.transitionSpeed * deltaTime
            this.currentHorizontalOffset += (horizontalBob - this.currentHorizontalOffset)
                * this.transitionSpeed * deltaTime

            this.camera.position.y = this.baseHeight + this.currentVerticalOffset
            const rightVector = new THREE.Vector3(1, 0, 0)
            rightVector.applyQuaternion(this.camera.quaternion)
            this.camera.position.add(
                rightVector.multiplyScalar(this.currentHorizontalOffset)
            )
        } else {
            this.headBobbingTimer = 0

            this.currentVerticalOffset *= 0.9
            this.currentHorizontalOffset *= 0.9

            this.camera.position.y = this.baseHeight + this.currentVerticalOffset
            const rightVector = new THREE.Vector3(1, 0, 0)
            rightVector.applyQuaternion(this.camera.quaternion)
            this.camera.position.add(
                rightVector.multiplyScalar(this.currentHorizontalOffset)
            )
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Give an update look at position for the camera
     * @returns {Vector3} The look at position
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