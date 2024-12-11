import * as THREE from 'three'
import * as RAPIER from "@dimforge/rapier3d"

import Game from "../Game.js"

class Ground {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.ressources = this.game.ressources
        this.world = this.game.world
        this.physics = this.game.physics

        this.setTextures()
        this.setGround()
    }

    setTextures() {
        this.textures = {}

        this.textures.diff = this.ressources.items.groundDiffTexture
        this.textures.diff.colorSpace = THREE.SRGBColorSpace
        this.textures.diff.repeat.set(16, 16)
        this.textures.diff.wrapS = THREE.RepeatWrapping
        this.textures.diff.wrapT = THREE.RepeatWrapping

        this.textures.arm = this.ressources.items.groundArmTexture
        this.textures.arm.repeat.set(16, 16)
        this.textures.arm.wrapS = THREE.RepeatWrapping
        this.textures.arm.wrapT = THREE.RepeatWrapping

        this.textures.nor = this.ressources.items.groundNorTexture
        this.textures.nor.repeat.set(16, 16)
        this.textures.nor.wrapS = THREE.RepeatWrapping
        this.textures.nor.wrapT = THREE.RepeatWrapping
    }

    setGround() {
        // Physic Ground
        this.groundColliderDesc = RAPIER.ColliderDesc.cuboid(50.0, 0.0, 50.0)
            .setRestitution(0)
        this.groundCollider = this.physics.world.createCollider(this.groundColliderDesc)

        // Three Ground
        this.ground = new THREE.Mesh(
          new THREE.PlaneGeometry(100, 100, 100, 100),
          new THREE.MeshStandardMaterial({
              map: this.textures.diff,
              normalMap: this.textures.nor,
              aoMap: this.textures.arm,
              roughnessMap: this.textures.arm,
              metalnessMap: this.textures.arm,
              side: THREE.DoubleSide
          })
        )
        this.ground.rotation.x = -Math.PI * 0.5
        this.ground.position.y = 0
        this.scene.add(this.ground)

        this.world.addFixedObject('ground', this.ground, this.groundCollider, {enabled: false})
    }
}

export default Ground