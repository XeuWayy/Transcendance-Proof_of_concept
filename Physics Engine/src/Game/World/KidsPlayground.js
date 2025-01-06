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
        this.models = {}

        this.models.swing = this.ressources.items.swing.scene
        this.models.swing.position.y = 10
        console.log(this.models.swing);
        this.scene.add(this.models.swing)
    }
}

export default KidsPlayground