import Game from "../Game.js"
import * as THREE from "three"

class Cube {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.ressources = this.game.ressources
        this.physics = this.game.physics

        this.setTextures()
        this.setCube()
        this.addPhysicCube()
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
        this.position = [
            new THREE.Vector3(15,2.5, -30),
            new THREE.Vector3(-15,2.5, -30),
            new THREE.Vector3(15,2.5, 30),
            new THREE.Vector3(-15,2.5, 30)
        ]

        for (let i = 0; i < this.position.length; i++) {
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
            this.cube.position.set(this.position[i].x, this.position[i].y, this.position[i].z)
            this.addCubeToPhysic(this.cube)
            this.scene.add(this.cube)
        }
    }

    addCubeToPhysic(threeMesh) {
            const physicsBox = this.physics.createBox({
            name: 'Cube',
            threeObject: threeMesh,
            type: 'fixed',
            mass: 1000,
            friction: 0.7,
            restitution: 0,
            offset: {x: 0, y: 0, z: 0}
        })
        
    }

    addPhysicCube() {

        let cubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 2.0, 2.0),
            new THREE.MeshBasicMaterial({
                color: 'yellow'
            })
        )

        const cubeBody = this.physics.createBox({
            name: 'smallCube',
            threeObject: cubeMesh,
            type: 'dynamic',
            mass: 10,
            friction: 0.7,
            restitution: 0.3,
            offset: {x: 0, y: 0, z: 0}
        })
        this.scene.add(cubeMesh)      
    }
}
export default Cube