import Game from "../Game.js"
import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d";

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
            width: 5,
            height: 5,
            depth: 5,
            position: threeMesh.position,
            type: 'fixed'
        })
        this.game.world.addFixedObject('Cube', threeMesh, physicsBox, {x: 0, y: 0, z: 0})
    }

    addPhysicCube() {
        let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0.0, 100.0, 0.0)
        this.rigidBody = this.physics.world.createRigidBody(rigidBodyDesc)

        let colliderDesc = RAPIER.ColliderDesc.cuboid(1.0, 1.0, 1.0)
        let cubeCollider = this.physics.world.createCollider(colliderDesc, this.rigidBody)

        let cubeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(2.0, 2.0, 2.0),
            new THREE.MeshBasicMaterial({
                color: 'yellow'
            })
        )
        const position = this.rigidBody.translation()
        const rotation = this.rigidBody.rotation()

        cubeMesh.position.set(position.x, position.y, position.z)
        cubeMesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w)

        this.scene.add(cubeMesh)
        this.game.world.addDynamicObject('cube', cubeMesh, this.rigidBody, {x: 0, y: 0, z: 0})

    }
}
export default Cube