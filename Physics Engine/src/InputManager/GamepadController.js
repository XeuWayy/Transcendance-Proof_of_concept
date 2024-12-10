class GamepadController {
    constructor() {
        this.current = {
            leftStickX: 0,
            leftStickY: 0,
            rightStickX: 0,
            rightStickY: 0,
            buttons0: false,
            buttons1: false,
            buttons4: false,
            isConnected: false
        }
        this.deadzone = 0.05
        this.lookSensivity = 0.04

        window.addEventListener('gamepadconnected', () => this.gamepadConnected())
        window.addEventListener('gamepaddisconnected', () => this.gamepadDisconnected())
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Set the gamepad state
     */
    gamepadConnected() {
        this.current.isConnected = true
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Set the gamepad state
     */
    gamepadDisconnected() {
        this.current.isConnected = false
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Check if the input is in the deadzone
     */
    applyDeadzone(value) {
        return Math.abs(value) < this.deadzone ? 0 : value
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Update the state of gamepad input
     */
    update() {
        const gamepads = navigator.getGamepads()

        if (!gamepads[0]) {
            return
        }
        const gamepad = gamepads[0]

        this.current.leftStickX = this.applyDeadzone(gamepad.axes[0])
        this.current.leftStickY = this.applyDeadzone(gamepad.axes[1])

        this.current.rightStickX = this.applyDeadzone(gamepad.axes[2]) * this.lookSensivity
        this.current.rightStickY = this.applyDeadzone(gamepad.axes[3]) * this.lookSensivity
        this.current.buttons0 = gamepad.buttons[0].pressed
        this.current.buttons1 = gamepad.buttons[1].pressed
        this.current.buttons4 = gamepad.buttons[4].pressed

    }
}

export default GamepadController