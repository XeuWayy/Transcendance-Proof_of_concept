import Game from "../Game.js"

class KidsPlayground {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.ressources = this.game.ressources
        this.physics = this.game.physics

        this.loadModel()
    }

    loadModel(){
        
    }
}

export default KidsPlayground