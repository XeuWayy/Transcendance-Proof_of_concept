import * as THREE from 'three/webgpu'

import Game from "../Game.js"

class Environment {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene

        this.setLight()
    }

    setLight() {

        this.defaultLight = new THREE.AmbientLight('#FFFFFF', 2)
        this.defaultLight.position.set(5,5,0)
        this.scene.add(this.defaultLight)

        this.tvLight = new THREE.PointLight('white', 3)
        this.tvLight.position.set(15, 3, -22)
        this.scene.add(this.tvLight)
    }
}
export default Environment