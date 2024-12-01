import Game from "../Game.js"
import Environment from "./Environment.js"
import Ground from "./Ground.js"
import Cube from "./Cube.js"
import Pong from "./Pong.js"
import Tetris from "./Tetris.js"
import Player from "./Player.js"

class World {
    constructor() {
        this.game = new Game()
        this.scene =  this.game.scene
        this.ressources = this.game.ressources

        this.loaded = false
        this.dynamicObjects = []
        this.staticObjects = []

        this.ressources.on('loaded', () => {
            this.loaded = true
            this.environment = new Environment()
            this.ground = new Ground()
            this.cube = new Cube()
            this.pong = new Pong()
            this.tetris = new Tetris()
            this.player = new Player()
        })
    }

    addDynamicObject(name, threeMesh, rapierBody) {
        this.dynamicObjects.push({ name, threeMesh, rapierBody })
    }

    addStaticObject(name, threeMesh, rapierBody) {
        this.staticObjects.push({ name, threeMesh, rapierBody })
    }

    removeDynamicObject(name) {
        this.dynamicObjects = this.dynamicObjects.filter(obj => obj.name !== name)
    }

    removeStaticObject(name) {
        this.staticObjects = this.staticObjects.filter(obj => obj.name !== name)
    }


    update() {
        if (this.loaded) {
            this.player.update()

            this.dynamicObjects.forEach(({ threeMesh, rapierBody }) => {
                const position = rapierBody.translation()
                const rotation = rapierBody.rotation()
                threeMesh.position.set(position.x, position.y, position.z)
                threeMesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)
            });

            this.tetris.update()
        }
    }
}
export default World