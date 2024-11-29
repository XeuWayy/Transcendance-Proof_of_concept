import Game from "../Game.js"
import * as THREE from "three"

class Cube {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.ressources = this.game.ressources

        this.setTextures()
        this.setCube()
    }

    setTextures() {
        this.textures = {}

        this.textures.diff = this.ressources.items.cubeDiffTexture
        this.textures.diff.colorSpace = THREE.SRGBColorSpace
        this.textures.diff.repeat.set(2, 2)
        this.textures.diff.wrapS = THREE.RepeatWrapping
        this.textures.diff.wrapT = THREE.RepeatWrapping

        this.textures.arm = this.ressources.items.cubeArmTexture
        this.textures.arm.repeat.set(2, 2)
        this.textures.arm.wrapS = THREE.RepeatWrapping
        this.textures.arm.wrapT = THREE.RepeatWrapping

        this.textures.nor = this.ressources.items.cubeNorTexture
        this.textures.nor.repeat.set(2, 2)
        this.textures.nor.wrapS = THREE.RepeatWrapping
        this.textures.nor.wrapT = THREE.RepeatWrapping
    }

    setCube() {
        const position = [
            new THREE.Vector3(15,2.5, -30),
            new THREE.Vector3(-15,2.5, -30),
            new THREE.Vector3(15,2.5, 30),
            new THREE.Vector3(-15,2.5, 30)
        ]

        for (let i = 0; i < position.length; i++) {
            this.cube = new THREE.Mesh(
                new THREE.BoxGeometry(5, 5, 5, 32, 32),
                new THREE.MeshStandardMaterial({
                    map: this.textures.diff,
                    normalMap: this.textures.nor,
                    aoMap: this.textures.arm,
                    roughnessMap: this.textures.arm,
                    metalnessMap: this.textures.arm
                })
            )
            this.cube.position.set(position[i].x, position[i].y, position[i].z)
            this.scene.add(this.cube)
        }
    }
}
export default Cube