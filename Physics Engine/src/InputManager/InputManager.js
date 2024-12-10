import KeyboardMouseController from "./KeyboardMouseController.js"
import GamepadController from "./GamepadController.js"

class InputManager {
    constructor() {
        this.keyboardMouseController = new KeyboardMouseController()
        this.gamepadController = new GamepadController()
        this.activeInputController = 'keyboardMouse'

        this.previousInputs = {
            jump: false,
            crouch: false
        }

        this.inputs = {
            forward: 0,
            strafe: 0,
            jump: { pressed: false, held: false, released: false },
            crouch: { pressed: false, held: false, released: false },
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
        let currentJump, currentCrouch

        if (this.activeInputController === 'keyboardMouse') {
            currentJump = this.keyboardMouseController.keys['Space'] ? this.keyboardMouseController.keys['Space'] : false
            currentCrouch = this.keyboardMouseController.keys['ControlLeft']? this.keyboardMouseController.keys['ControlLeft'] : false
            
            this.inputs = {
                forward: (this.keyboardMouseController.keys['KeyW'] ? 1 : 0) + (this.keyboardMouseController.keys['KeyS'] ? -1 : 0),
                strafe: (this.keyboardMouseController.keys['KeyA'] ? 1 : 0) + (this.keyboardMouseController.keys['KeyD'] ? -1 : 0),
                jump: this.computeActionState(currentJump, this.previousInputs.jump),
                crouch: this.computeActionState(currentCrouch, this.previousInputs.crouch),
                rotation: {
                    x: this.keyboardMouseController.current.mouseXDelta,
                    y: this.keyboardMouseController.current.mouseYDelta
                }
            }
        } else {
            currentJump = this.gamepadController.current.buttons0
            currentCrouch = this.gamepadController.current.buttons1
            this.inputs = {
                forward: -this.gamepadController.current.leftStickY,
                strafe: -this.gamepadController.current.leftStickX,
                jump: this.computeActionState(currentJump, this.previousInputs.jump),
                crouch: this.computeActionState(currentCrouch, this.previousInputs.crouch),
                rotation: {
                    x: this.gamepadController.current.rightStickX,
                    y: this.gamepadController.current.rightStickY
                }
            }
        }

        this.previousInputs.jump = currentJump
        this.previousInputs.crouch = currentCrouch
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
}

export default InputManager