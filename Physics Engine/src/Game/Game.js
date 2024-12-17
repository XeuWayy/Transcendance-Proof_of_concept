import * as THREE from 'three/webgpu'
import Stats from "three/addons/libs/stats.module.js"
import GUI from 'lil-gui'

import Sizes from "./Sizes.js"
import Time from "./Utils/Time.js"
import Camera from "./Camera.js"
import Renderer from "./Renderer.js"
import World from "./World/World.js"
import sources from "./sources.js"
import Ressources from "./Utils/Ressources.js"
import Physics from "./Physics/Physics.js"

let singletonGame

class Game {
    constructor(canvas) {
        if (singletonGame) {
            return singletonGame
        }

        singletonGame = this

        this.canvas = canvas
        this.isFirefoxbasedbrowser = navigator.userAgent.includes("Firefox")

        // Debug
        this.gui = new GUI({ width: 340 })
        this.debugObject = {}

        this.gameReady = false
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.ressources = new Ressources(sources)
        this.physics = new Physics()
        this.world = new World()

        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })

        // FPS Count
        this.stats = new Stats()
        this.stats.domElement.style.position = 'absolute'
        this.stats.domElement.style.top = '0px'
        document.body.appendChild(this.stats.dom)
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        if (this.gameReady) {
            this.stats.begin()
            this.physics.update()
            this.camera.update()
            this.world.update()
            this.renderer.update()
            this.stats.end()
        }
    }
}

export default Game