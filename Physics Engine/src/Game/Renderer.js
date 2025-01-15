import * as THREE from 'three/webgpu'
import Game from "./Game.js"


class Renderer {
    constructor() {
        this.game = new Game()
        this.sizes = this.game.sizes
        this.scene = this.game.scene
        this.canvas = this.game.canvas
        this.camera = this.game.camera
        this.gui = this.game.gui
        this.debugObject = this.game.debugObject
        this.setInstance()
        this.setDebug()
    }

    setDebug() {
        this.debugObject = this.game.debugObject

        this.rendererDebug = this.game.gui.addFolder({title: "🦄 - Renderer Debug", expanded: false})

        this.debugObject.toneMappingExposure = 0.75

        this.rendererDebug.addBinding(this.instance, 'toneMapping', {
            label: 'Three.js tone mapping',
            options: {
                No: THREE.NoToneMapping,
                Linear: THREE.LinearToneMapping,
                Reinhard: THREE.ReinhardToneMapping,
                Cineon: THREE.CineonToneMapping,
                ACESFilmic: THREE.ACESFilmicToneMapping
            }
        })
        this.rendererDebug.addBinding(this.debugObject, 'toneMappingExposure', {label: 'Tone mapping exposure', min: 0, max: 1}).on('change', () => {this.instance.toneMappingExposure = this.debugObject.toneMappingExposure})
    }

    setInstance() {
        this.instance = new THREE.WebGPURenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            forceWebGL: true
        })
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.toneMapping = THREE.LinearToneMapping
        this.instance.toneMappingExposure = 0.75
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        this.instance.renderAsync(this.scene, this.camera.instance)

        // Renderer Information
        //console.log(this.instance.info.render)
    }

    cleanup() {
        this.game = null
        this.sizes = null
        this.scene = null
        this.canvas = null
        this.camera = null
        this.gui = null

        this.instance.dispose()
        if (this.rendererDebug) {
            this.debugObject = null
            this.rendererDebug.dispose()
        }
    }
}

export default Renderer