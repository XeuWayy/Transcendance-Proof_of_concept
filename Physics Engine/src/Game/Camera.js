import * as THREE from 'three'

import Game from "./Game.js"
import FirstPersonCamera from "../FPVCamera/FirstPersonCamera.js"
import CrosshairVertex from "../shaders/crosshair/vertex.glsl"
import CrosshairFragment from "../shaders/crosshair/fragment.glsl"

class Camera {
    constructor() {
        this.game = new Game()
        this.sizes = this.game.sizes
        this.scene = this.game.scene
        this.canvas = this.game.canvas
        this.time = this.game.time

        this.setInstance()
        this.setCrosshair()
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 250)

        this.instance.position.set(0, 1.7, 0)
        this.scene.add(this.instance)
        
        this.fpsCamera = new FirstPersonCamera(this)
    }

    setCrosshair() {
        // @author https://codepen.io/driezis/pen/jOPzjLG
        const crosshair = new THREE.ShaderMaterial({
            uniforms: {
                mainColor: {value: {r: 0, g: 1, b: 0.75}},
                border_Color: {value: {r: 0, g: 0, b: 0}},

                thickness: {value: 0.005},
                height: {value: 0.007},
                offset: {value: 0},
                border: {value: 0.002},

                opacity: {value: 1},
                center: {value: {x: 0.5, y: 0.5}},
                rotation: {value: 0}
            },
            vertexShader: CrosshairVertex,
            fragmentShader: CrosshairFragment,
            transparent: true,
        })

        const crosshairSprite = new THREE.Sprite(crosshair)
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