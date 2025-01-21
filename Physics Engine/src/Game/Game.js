import * as THREE from 'three/webgpu'
import Stats from "three/addons/libs/stats.module.js"
import {ThreePerf} from 'three-perf'
import {Pane} from "tweakpane"

import Sizes from "./Sizes.js"
import Time from "./Utils/Time.js"
import Camera from "./Camera.js"
import Renderer from "./Renderer.js"
import World from "./World/World.js"
import sources from "./sources.js"
import Ressources from "./Utils/Ressources.js"
import Physics from "./Physics/Physics.js"
import Shaders from "./Utils/Shaders.js"

let singletonGame

class Game {
    constructor(canvas) {
        if (singletonGame) {
            return singletonGame
        }

        singletonGame = this

        this.canvas = canvas
        this.isFirefoxbasedbrowser = navigator.userAgent.includes("Firefox")

        this.cleanupBind = this.cleanup.bind(this)
        window.addEventListener('beforeunload', this.cleanupBind)

        // Debug
        this.gui = new Pane({title: "🚀 Transcendance - Playground 🚀"})
        this.injectCSS('.tp-dfwv {width: 350px !important}')
        this.debugObject = {}

        this.gameReady = false
        this.sizes = new Sizes()
        this.time = new Time()
        this.shaders = new Shaders()
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

        // FPS Count (Upper left)
        this.stats = new Stats()
        this.stats.domElement.style.position = 'absolute'
        this.stats.domElement.style.top = '0px'

        // Renderer perf (Bottom right)
        this.renderPerf = new ThreePerf({
            anchorX: 'right',
            anchorY: 'bottom',
            domElement: document.body,
            renderer: this.renderer.instance
        });
        document.body.appendChild(this.stats.dom)
    }

    injectCSS(css) {
        let element = document.createElement('style');
        element.type = 'text/css';
        element.innerText = css;
        document.head.appendChild(element);
    }

    resize() {
        this.camera.resize()
        this.renderer.resize()
    }

    update() {
        if (this.gameReady) {
            this.stats.begin()
            this.renderPerf.begin()
            this.physics.update()
            this.camera.update()
            this.world.update()
            this.renderer.update()
            this.renderPerf.end()
            this.stats.end()
        }
    }

    cleanup() {
        window.removeEventListener('beforeunload', this.cleanupBind)
        singletonGame = null

        if (this.sizes) {
            this.sizes.cleanup()
        }

        if (this.time) {
            this.time.cleanup()
        }

        if (this.scene) {
            this.scene.traverse(obj => {
                if (obj.material) {
                    obj.material.dispose()
                }
                if (obj.geometry) {
                    obj.geometry.dispose()
                }
                if (obj.texture) {
                    obj.texture.dispose()
                }
            })
            for (let i = this.scene.children.length - 1; i >= 0; i--) {
                this.scene.remove(this.scene.children[i])
            }
        }

        if (this.camera) {
            this.camera.cleanup()
        }

        if (this.renderer) {
            this.renderer.cleanup()
        }

        if (this.ressources) {
            this.ressources.cleanup()
        }

        if (this.physics) {
            this.physics.cleanup()
        }

        if (this.world) {
            this.world.cleanup()
        }

        if (this.renderPerf) {
            this.renderPerf.dispose()
        }

        if (this.gui) {
            this.gui.dispose()
        }

        for (const properties in this) {
            this[properties] = null
        }
    }
}

export default Game