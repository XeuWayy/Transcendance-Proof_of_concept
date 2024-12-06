import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'

import Game from "../Game.js"
import crtVertex from "../../shaders/crtScreen/vertex.glsl"
import crtFragment from "../../shaders/crtScreen/fragment.glsl"

class Pong{
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.ressources = this.game.ressources
        this.physics = this.game.physics

        this.setModel()
        this.loadModel()
        this.setPongVideo()
        this.addPhysics()
    }

    setModel() {
        this.model = {}

        const sofa = this.ressources.items.sofa.scene
        sofa.scale.set(0.003, 0.004, 0.004)
        const sofaGroup = new THREE.Group()
        const sofaBox = new THREE.Box3().setFromObject(sofa)
        const sofaVector = new THREE.Vector3()
        sofaBox.getSize(sofaVector)

        const halfHeight = sofaVector.y * 0.5

        this.model.sofa = sofaGroup
        sofa.position.y -= halfHeight
        sofa.position.z += sofaVector.z * 0.1
        sofaGroup.add(sofa)

        sofaGroup.position.set(15, 0, -26)

        this.model.tvTable = this.ressources.items.tvTable.scene
        this.model.tvTable.scale.set(1.25, 1, 1)
        this.model.tvTable.position.set(16, 0, -22.5)
        this.model.tvTable.rotation.y = Math.PI

        this.model.sadTv = this.ressources.items.sadTv.scene
        this.model.sadTv.scale.set(0.009, 0.009, 0.009)
        this.model.sadTv.position.set(15.5, 1.02, -22)
        this.model.sadTv.rotation.y = Math.PI

        this.model.coolerTv = this.ressources.items.coolerTv.scene
        this.model.coolerTv.position.set(14.25, 0.60, -22)
    }

    loadModel() {
        this.scene.add(this.model.sofa)
        this.scene.add(this.model.tvTable)
        this.scene.add(this.model.sadTv)
        this.scene.add(this.model.coolerTv)
    }

    setPongVideo() {
        const videoElement = document.querySelector('video.webglVideo')
        const pongTexture = new THREE.VideoTexture(videoElement)

        const sadTvPong = new THREE.Mesh(
            new THREE.PlaneGeometry(0.74, 0.566),
            new THREE.MeshBasicMaterial({
                map: pongTexture,
                side: THREE.BackSide,
                transparent: true,
            })
        )
        sadTvPong.position.set(15.605, 1.04, -22.27)
        this.scene.add(sadTvPong)


        const coolTvPong = new THREE.Mesh(
            new THREE.PlaneGeometry(0.914, 0.686, 128, 128),
            new THREE.ShaderMaterial({
                uniforms: {
                    videoTexture: { value: pongTexture }
                },
                vertexShader: crtVertex,
                fragmentShader: crtFragment,
                side: THREE.DoubleSide
            }))
        coolTvPong.position.set(14.40, 1.11, -22.3565)
        coolTvPong.rotation.y = Math.PI
        this.scene.add(coolTvPong)
    }

    addPhysics() {
        const sofaBox = new THREE.Box3().setFromObject(this.model.sofa)
        const sofaVector = new THREE.Vector3()
        sofaBox.getSize(sofaVector)

        const halfExtents = { x: sofaVector.x * 0.5, y: sofaVector.y * 0.5, z: sofaVector.z * 0.5 }
        const colliderDesc = RAPIER.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z)
            .setFriction(1.2)
            .setMass(60)
            .setRestitution(0.2)

        const position = this.model.sofa.position

        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(position.x, position.y, position.z)
        const rigidBody = this.physics.world.createRigidBody(rigidBodyDesc)
        this.physics.world.createCollider(colliderDesc, rigidBody)

        this.game.world.addDynamicObject('sofa', this.model.sofa, rigidBody, { x: 0, y: 0, z: 0 })
    }

}
export default Pong