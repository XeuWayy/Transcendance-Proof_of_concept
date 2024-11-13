import KeyboardMouseController from "./KeyboardMouseController.js";
import GamepadController from "./GamepadController.js";

class InputManager {
    constructor() {
        this.keyboardMouseController = new KeyboardMouseController()
        this.gamepadController = new GamepadController()
        this.activeInputController = 'keyboardMouse'
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Check and update the current active method of input
     */
    update () {
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
     * @desc Get the current input for the movement
     */
    getMovementInput() {
        if (this.activeInputController === 'keyboardMouse') {
            return {
                forward: (this.keyboardMouseController.keys['KeyW'] ? 1 : 0) + (this.keyboardMouseController.keys['KeyS'] ? -1 : 0),
                strafe: (this.keyboardMouseController.keys['KeyA'] ? 1 : 0) + (this.keyboardMouseController.keys['KeyD'] ? -1 : 0)
            }
        } else {
            return {
                forward: -this.gamepadController.current.leftStickY,
                strafe: -this.gamepadController.current.leftStickX
            }
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Get the current input for the rotation
     */
    getRotationInput() {
        if (this.activeInputController === 'keyboardMouse') {
            return {
                x:  this.keyboardMouseController.current.mouseXDelta,
                y: this.keyboardMouseController.current.mouseYDelta
            }
        } else {
            return {
                x: this.gamepadController.current.rightStickX,
                y: this.gamepadController.current.rightStickY
            }
        }
    }
}

export default InputManager