import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import LanguageManager from "../LanguageManager/LanguageManager.js"
import button from "bootstrap/js/src/button.js";
import {overlay} from "three/nodes";

class OverlayManager {
    constructor() {
        this.overlay = document.getElementById('overlay')
        this.languageManager = new LanguageManager()
        this.isInitialized = false
    }

    async initialize() {
        if(this.isInitialized) {
            return
        }

        try {
            const response = await fetch('./GameOverlay/overlay.html')
            this.overlay.innerHTML = await response.text()
            this.overlay.style.display = 'block'
    
            this.initializeLanguageEvent()
            
            await this.languageManager.updateContent('overlay')

            this.isInitialized = true
        } catch (error) {
            console.error(`Error while initializing overlay: ${error}`)
        }

    }

    initializeLanguageEvent() {
        document.querySelectorAll('#header li').forEach(item => {
            item.addEventListener('click', (event) => {
                const lang = event.target.getAttribute('lang')
                this.languageManager.changeLanguage(lang, 'overlay')
            })
        })
    }

    async toggle() {
        if (this.overlay.style.display === 'none' || !this.overlay.hasChildNodes()) {
            await this.initialize()
            this.overlay.style.display = 'block'
        } else {
            this.overlay.style.display = 'none'
        }
    }
}

const overlayManager = new OverlayManager()

window.addEventListener('keydown', (event) => {
    if (event.code === 'ShiftLeft') {
        console.log("pressed")
        overlayManager.toggle()
    }
})

// Gamepad Support

let animationFrame
let previousButtonState = false

const gamepadConnected = () => {
    gamepadUpdate()
}

const gamepadUpdate = () => {
    const gamepads = navigator.getGamepads()

    if (!gamepads[0]) {
        return
    }
    const gamepad = gamepads[0]
    const isPressed = gamepad.buttons.at(9).pressed;

    if (isPressed && !previousButtonState) {
        overlayManager.toggle()
    }
    previousButtonState = isPressed

    animationFrame = requestAnimationFrame(gamepadUpdate)
}

const gamepadDisconnected = () => {
    cancelAnimationFrame(animationFrame)
}

window.addEventListener('gamepadconnected', () => gamepadConnected())
window.addEventListener('gamepaddisconnected', () => gamepadDisconnected())
