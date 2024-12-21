import * as THREE from 'three/webgpu'

import Game from "./Game.js"
import FirstPersonCamera from "../FPVCamera/FirstPersonCamera.js"


class Camera {
    constructor() {
        this.game = new Game()
        this.sizes = this.game.sizes
        this.scene = this.game.scene
        this.canvas = this.game.canvas
        this.time = this.game.time
        this.shaders = this.game.shaders

        this.setInstance()
        this.setCrosshair()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 250)

        this.instance.position.set(0, 1.7, 0)
        this.scene.add(this.instance)
        
        this.fpsCamera = new FirstPersonCamera(this.instance)
    }

    setCrosshair() {
        const crosshairMaterial = new THREE.SpriteNodeMaterial({
            transparent: true
        })

        crosshairMaterial.fragmentNode = this.shaders.fragmentCrosshair()

        const crosshairSprite = new THREE.Sprite(crosshairMaterial)
        crosshairSprite.position.set(0,0,-0.5)
        this.instance.add(crosshairSprite)
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.fpsCamera.update(this.time.delta / 1000)
    }
}
export default Camera