import { log } from "three/examples/jsm/nodes/Nodes.js"
import Game from "../Game/Game.js"


class InteractManager {
    constructor(cameraClass, inputManagerClass) {
        console.log(cameraClass)
        this.game = new Game()
        this.camera = cameraClass
        this.inputManager = inputManagerClass
    }

    update () {
        console.log(this.camera, this.inputManager)
        
    }
}

export default InteractManager