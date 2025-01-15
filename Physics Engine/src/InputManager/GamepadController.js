import Game from "../Game/Game.js"

class GamepadController {
    constructor() {
        this.game = new Game()
        this.isFirefoxbasedbrowser = this.game.isFirefoxbasedbrowser
        this.current = {
            leftStickX: 0,
            leftStickY: 0,
            rightStickX: 0,
            rightStickY: 0,
            aButton: false,
            bButton: false,
            rTrigger: false,
            rJoyButton: false,
            lJoyButton: false,
            isConnected: false
        }
        this.deadzone = 0.05
        this.lookSensivity = 0.04

        this.gamepadConnectedBind = this.gamepadConnected.bind(this)
        this.gamepadDisconnectedBind = this.gamepadDisconnected.bind(this)

        window.addEventListener('gamepadconnected', this.gamepadConnectedBind)
        window.addEventListener('gamepaddisconnected', this.gamepadDisconnectedBind)
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

        if (this.isFirefoxbasedbrowser) {
            this.current.rightStickX = this.applyDeadzone(gamepad.axes[4]) * this.lookSensivity
            this.current.rightStickY = this.applyDeadzone(gamepad.axes[5]) * this.lookSensivity
            this.current.rTrigger = gamepad.axes[6] > -1 && gamepad.axes[6] !== 0
        } else {
          this.current.rightStickX = this.applyDeadzone(gamepad.axes[2]) * this.lookSensivity
          this.current.rightStickY = this.applyDeadzone(gamepad.axes[3]) * this.lookSensivity
          this.current.rTrigger = gamepad.buttons[7].pressed
        }

        this.current.aButton = gamepad.buttons[0].pressed
        this.current.bButton = gamepad.buttons[1].pressed
        this.current.rJoyButton = gamepad.buttons[11].pressed
        this.current.lJoyButton = gamepad.buttons[10].pressed
    }
}

export default GamepadController