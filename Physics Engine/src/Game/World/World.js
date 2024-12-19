import Game from "../Game.js"
import Environment from "./Environment.js"
import Ground from "./Ground.js"
import Cube from "./Cube.js"
import Pong from "./Pong.js"
import Tetris from "./Tetris.js"
import Player from "./Player.js"
import Test from "./Test.js"

class World {
    constructor() {
        this.game = new Game()
        this.scene =  this.game.scene
        this.ressources = this.game.ressources
        this.interactManager = this.game.camera.fpsCamera.inputManager.interactManager

        this.loaded = false
        this.dynamicObjects = []
        this.fixedObjects = []

        this.ressources.on('loaded', () => {
            this.loaded = true
            this.game.gameReady = true
            this.environment = new Environment()
            this.ground = new Ground()
            this.cube = new Cube()
            this.pong = new Pong()
            this.tetris = new Tetris()
            this.player = new Player()
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
}
export default World