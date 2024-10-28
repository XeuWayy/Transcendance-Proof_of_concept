import * as THREE from 'three'
import InputController from "./InputController.js";

class FirstPersonCamera {
  /**
   * @author Corentin (XeuWayy) Charton
   * @desc Construct a first person camera
   * @param camera The three.js camera
   */
  constructor(camera) {
    this.camera = camera
    this.input = new InputController()
    this.rotation = new THREE.Quaternion()
    this.translation = new THREE.Vector3()
    this.phi = 0
    this.theta = 0
    this.mouseSensitivity = 0.002
    this.cameraSpeed = 10

    this.baseHeight = camera.position.y

    // Vertical bobbing
    this.verticalBobbingAmplitude = 0.15
    this.verticalBobbingFrequency = 10

    // Horizontal bobbing
    this.horizontalBobbingAmplitude = 0.015
    this.horizontalBobbingFrequency = 5

    // Phase difference between vertical and horizontal bobbing
    this.bobbingPhaseOffset = Math.PI / 2

    // Smooth transition
    this.currentVerticalOffset = 0
    this.currentHorizontalOffset = 0
    this.transitionSpeed = 8

    // Store the base position
    this.basePosition = new THREE.Vector3()
  }

  /**
   * @author Corentin (XeuWayy) Charton
   * @desc Calculate && update the camera rotation && position
   * @param elapsedTime The elapsedTime between the update
   */
  update (elapsedTime) {
    this.updateRotation()
    this.updateTranslation(elapsedTime)
    this.updateCamera()
    this.updateHeadBobbing(elapsedTime)
    this.camera.lookAt(this.focusTarget())
    this.input.update()
  }

  /**
   * @author Corentin (XeuWayy) Charton
   * @desc Calculate the rotation of camera based on the mouse input
   */
  updateRotation() {
    if (this.input.current.isLocked) {
      const horizontalRotation = this.input.current.mouseXDelta * this.mouseSensitivity
      const verticalRotation = this.input.current.mouseYDelta * this.mouseSensitivity

      this.phi += -horizontalRotation
      this.theta = THREE.MathUtils.clamp(
        this.theta + -verticalRotation, -Math.PI / 3, Math.PI / 3
      )

      const quaternionX = new THREE.Quaternion()
      quaternionX.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)

      const quaternionZ = new THREE.Quaternion()
      quaternionZ.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.theta)

      const quaternion = new THREE.Quaternion()
      quaternion.multiply(quaternionX)
      quaternion.multiply(quaternionZ)

      this.rotation.copy(quaternion)
    }
  }

  /**
   * @author Corentin (XeuWayy) Charton
   * @desc Calculate the camera position
   * @param elapsedTime The elapsedTime between the update
   */
  updateTranslation(elapsedTime) {
    const forwardVelocity = (this.input.keys['z'] ? 1 : 0) + (this.input.keys['s'] ? -1 : 0)
    const strafeVelocity = (this.input.keys['q'] ? 1 : 0) + (this.input.keys['d'] ? -1 : 0)

    this.headBobbingActive = forwardVelocity !== 0 || strafeVelocity !== 0

    const quaternionX = new THREE.Quaternion()
    quaternionX.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.phi)

    const forward = new THREE.Vector3(0, 0, -1)
    forward.applyQuaternion(quaternionX)
    forward.multiplyScalar(forwardVelocity * this.cameraSpeed * elapsedTime)

    const left = new THREE.Vector3(-1, 0, 0)
    left.applyQuaternion(quaternionX)
    left.multiplyScalar(strafeVelocity * this.cameraSpeed * elapsedTime)

    this.translation.add(forward)
    this.translation.add(left)
  }

  /**
   * @author Corentin (XeuWayy) Charton
   * @desc Implement small camera movement to simulate human head moving
   * @param elapsedTime The elapsedTime between the update
   */
  updateHeadBobbing(elapsedTime) {
    console.log(this.camera.position)
    if (this.headBobbingActive) {
      this.headBobbingTimer += elapsedTime

      const verticalBob = Math.sin(this.headBobbingTimer * this.verticalBobbingFrequency) * this.verticalBobbingAmplitude

      const horizontalBob = Math.sin(
        this.headBobbingTimer * this.horizontalBobbingFrequency + this.bobbingPhaseOffset
      ) * this.horizontalBobbingAmplitude

      this.currentVerticalOffset += (verticalBob - this.currentVerticalOffset)
        * this.transitionSpeed * elapsedTime
      this.currentHorizontalOffset += (horizontalBob - this.currentHorizontalOffset)
        * this.transitionSpeed * elapsedTime

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
    let pos = new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z);

    let forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.multiplyScalar(15);

    pos.add(forward);
    return pos;
  }

  /**
   * @author Corentin (XeuWayy) Charton
   * @desc Update the camera rotation && position
   */
  updateCamera() {
    this.camera.quaternion.copy(this.rotation)
    this.camera.position.add(this.translation)

    this.translation.set(0, 0, 0)
  }
}

export default FirstPersonCamera