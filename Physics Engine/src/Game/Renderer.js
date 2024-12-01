import * as THREE from 'three'
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
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        })
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)

        this.debugObject.clearColor = '#160920'
        this.gui.addColor(this.debugObject, 'clearColor').onChange(() => { this.instance.setClearColor(this.debugObject.clearColor) })
        this.instance.setClearColor('#160920')
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }
}

export default Renderer