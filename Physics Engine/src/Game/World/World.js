import Game from "../Game.js"
import Environment from "./Environment.js"
import Ground from "./Ground.js"
import Cube from "./Cube.js"
import Pong from "./Pong.js"
import Tetris from "./Tetris.js"

class World {
    constructor() {
        this.game = new Game()
        this.scene =  this.game.scene
        this.ressources = this.game.ressources

        this.loaded = false

        this.ressources.on('loaded', () => {
            this.loaded = true
            this.environment = new Environment()
            this.ground = new Ground()
            this.cube = new Cube()
            this.pong = new Pong()
            this.tetris = new Tetris()
        })
    }

    update() {
        if (this.loaded) {
            this.tetris.update()
        }
    }
}
export default World