import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import LanguageManager from "../LanguageManager/LanguageManager.js"

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
        overlayManager.toggle()
    }
})