import KeyboardMouseController from "./KeyboardMouseController.js"
import GamepadController from "./GamepadController.js"
import InteractManager from "./InteractManager.js"

class InputManager {
    constructor() {
        this.keyboardMouseController = new KeyboardMouseController()
        this.gamepadController = new GamepadController()
        this.interactManager = new InteractManager()
        this.activeInputController = 'keyboardMouse'
        this.activeInputControlMode = 'moving'

        this.previousInputs = {
            jump: false,
            run: false,
            crouch: false,
            interact: false,
            throw: false
        }

        this.inputs = {
            forward: 0,
            strafe: 0,
            jump: { pressed: false, held: false, released: false },
            run: { pressed: false, held: false, released: false },
            crouch: { pressed: false, held: false, released: false },
            interact: { pressed: false, held: false, released: false },
            throw: { pressed: false, held: false, released: false },
            rotation: { x: 0, y: 0 }
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Check and update the current active method of input
     */
    update () {
        this.updateInputs()
        this.keyboardMouseController.update()
        this.gamepadController.update()
        this.interactManager.update()
        
        if (this.gamepadController.current.isConnected &&
            (Math.abs(this.gamepadController.current.leftStickX) > this.gamepadController.deadzone ||
            Math.abs(this.gamepadController.current.leftStickY) > this.gamepadController.deadzone ||
            Math.abs(this.gamepadController.current.rightStickX) > this.gamepadController.deadzone ||
            Math.abs(this.gamepadController.current.rightStickY) > this.gamepadController.deadzone)) {
            this.activeInputController = 'gamepad'
        }

        if (Object.values(this.keyboardMouseController.keys).some(key => key) ||
            this.keyboardMouseController.current.mouseXDelta !== 0 ||
            this.keyboardMouseController.current.mouseYDelta !== 0) {
            this.activeInputController = 'keyboardMouse'
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Update the input
     */
    updateInputs() {
        if (this.activeInputControlMode === 'moving') {
            this.updateMovingMode()
        } else if (this.activeInputControlMode === 'playingGame') {
            this.updatePlayingMode()
        }
    }

    updateMovingMode () {
        let currentJump, currentRun, currentCrouch, currentInteract, currentThrow

        if (this.activeInputController === 'keyboardMouse') {
            currentJump = this.keyboardMouseController.keys['Space'] ? this.keyboardMouseController.keys['Space'] : false
            currentRun = this.keyboardMouseController.keys['ShiftLeft'] ? this.keyboardMouseController.keys['ShiftLeft'] : false
            currentCrouch = this.keyboardMouseController.keys['KeyC']? this.keyboardMouseController.keys['KeyC'] : false
            currentInteract = this.keyboardMouseController.keys['KeyE']? this.keyboardMouseController.keys['KeyE'] : false
            currentThrow = this.keyboardMouseController.current.leftButton

            this.inputs.forward = (this.keyboardMouseController.keys['KeyW'] ? 1 : 0) + (this.keyboardMouseController.keys['KeyS'] ? -1 : 0)
            this.inputs.strafe = (this.keyboardMouseController.keys['KeyA'] ? 1 : 0) + (this.keyboardMouseController.keys['KeyD'] ? -1 : 0)

            this.inputs.rotation.x = this.keyboardMouseController.current.mouseXDelta
            this.inputs.rotation.y = this.keyboardMouseController.current.mouseYDelta
        } else {
            currentJump = this.gamepadController.current.aButton
            currentRun = this.gamepadController.current.lJoyButton
            currentCrouch = this.gamepadController.current.rJoyButton
            currentInteract = this.gamepadController.current.bButton
            currentThrow = this.gamepadController.current.rTrigger

            this.inputs.forward = -this.gamepadController.current.leftStickY
            this.inputs.strafe = -this.gamepadController.current.leftStickX

            this.inputs.rotation.x = this.gamepadController.current.rightStickX
            this.inputs.rotation.y = this.gamepadController.current.rightStickY
        }

        this.inputs.jump = this.computeActionState(currentJump, this.previousInputs.jump)
        this.inputs.run = this.computeActionState(currentRun, this.previousInputs.run)
        this.inputs.crouch = this.computeActionState(currentCrouch, this.previousInputs.crouch)
        this.inputs.interact = this.computeActionState(currentInteract, this.previousInputs.interact)
        this.inputs.throw = this.computeActionState(currentThrow, this.previousInputs.throw)

        this.previousInputs.jump = currentJump
        this.previousInputs.run = currentRun
        this.previousInputs.crouch = currentCrouch
        this.previousInputs.interact = currentInteract
        this.previousInputs.throw = currentThrow
    }

    updatePlayingMode() {
        let currentInteract
        if (this.activeInputController === 'keyboardMouse') {
            currentInteract = this.keyboardMouseController.keys['KeyE']? this.keyboardMouseController.keys['KeyE'] : false
        } else {
            currentInteract = this.gamepadController.current.bButton
        }
        this.inputs.interact = this.computeActionState(currentInteract, this.previousInputs.interact)

        this.previousInputs.interact = currentInteract
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Set three state for a key
     */
    computeActionState(current, previous) {
        return {
            pressed: current && !previous,
            held: current,
            released: !current && previous
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Return all inputs
     */
    getInputs() {
        return this.inputs
    }

    cleanup() {
        if (this.keyboardMouseController) {
            this.keyboardMouseController.cleanup()
        }
        if (this.gamepadController) {
            this.gamepadController.cleanup()
        }
        if (this.interactManager) {
            this.interactManager.cleanup()
        }

        for (const properties in this) {
            this[properties] = null
        }
    }
}

export default InputManager