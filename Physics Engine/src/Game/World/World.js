import Game from "../Game.js"
import Environment from "./Environment.js"
import Ground from "./Ground.js"
import Cube from "./Cube.js"
import Pong from "./Pong.js"
import Tetris from "./Tetris.js"
import Player from "./Player.js"
import Test from "./Test.js"
import KidsPlayground from "./KidsPlayground.js"

class World {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.ressources = this.game.ressources
        this.interactManager = this.game.camera.fpsCamera.inputManager.interactManager

        this.loaded = false
        this.dynamicObjects = []
        this.fixedObjects = []

        this.ressources.on('loaded', () => {
            this.loaded = true
            this.game.gameReady = true
            this.player = new Player()
            this.environment = new Environment()
            this.ground = new Ground()
            this.cube = new Cube()
            this.pong = new Pong()
            this.tetris = new Tetris()
            this.kidPlayground = new KidsPlayground()
            this.test = new Test()
        })
    }

    addDynamicObject(name, threeMesh, rapierBody, interact) {
        this.dynamicObjects.push({name, threeMesh, rapierBody})
        if (interact.enabled) {
            this.interactManager.interactList.push(interact)
        }
    }

    addFixedObject(name, threeMesh, rapierBody, interact) {
        this.fixedObjects.push({name, threeMesh, rapierBody})
        if (interact.enabled) {
            this.interactManager.interactList.push(interact)
        }
    }

    removeDynamicObject(name) {
        this.dynamicObjects = this.dynamicObjects.filter(obj => obj.name !== name)
    }

    removeFixedObject(name) {
        this.fixedObjects = this.fixedObjects.filter(obj => obj.name !== name)
    }

    update() {
        if (this.loaded) {
            this.player.update()
            this.dynamicObjects.forEach(({threeMesh, rapierBody}) => {
                const position = rapierBody.translation()
                const rotation = rapierBody.rotation()

                threeMesh.position.set(position.x, position.y , position.z)
                threeMesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
            })

            this.tetris.update()
        }
    }

    cleanup() {
        if (this.player) {
            this.player.cleanup()
        }

        if (this.environment) {
            this.environment.cleanup()
        }

        if (this.ground) {
            this.ground.cleanup()
        }

        if (this.cube) {
            this.cube.cleanup()
        }

        if (this.pong) {
            this.pong.cleanup()
        }

        if (this.tetris) {
            this.tetris.cleanup()
        }

        if (this.kidPlayground) {
            this.kidPlayground.cleanup()
        }

        if (this.test) {
            this.test.cleanup()
        }

        for (const properties in this) {
            this[properties] = null
        }
    }
}
export default World