import * as THREE from 'three'

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
        this.setPongVideo()
        this.loadModel()
        this.addPhysics()
    }

    setModel() {
        this.model = {}

        this.model.sofa = this.ressources.items.sofa.scene
        this.model.sofa.scale.set(0.003, 0.004, 0.004)
        this.model.sofa.position.set(15, 0, -26)

        this.model.tvTable = this.ressources.items.tvTable.scene
        this.model.tvTable.scale.set(1.25, 1, 1)
        this.model.tvTable.position.set(15, 0.3, -22)

        const sadTv = this.ressources.items.sadTv.scene
        sadTv.scale.set(0.009, 0.009, 0.009)
        sadTv.rotation.y = Math.PI

        this.model.sadTv = new THREE.Group()
        this.model.sadTv.position.set(15.5, 1.02, -22)
        this.model.sadTv.add(sadTv)

        const coolerTv = this.ressources.items.coolerTv.scene

        this.model.coolerTv = new THREE.Group()
        this.model.coolerTv.position.set(14.25, 0.60, -22)
        this.model.coolerTv.add(coolerTv)
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
            new THREE.PlaneGeometry(0.74, 0.57),
            new THREE.MeshBasicMaterial({
                map: pongTexture,
                side: THREE.BackSide,
                transparent: true,
            })
        )
        sadTvPong.position.set(0.10, 0.01, -0.26)
        this.model.sadTv.add(sadTvPong)


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
        coolTvPong.position.set(0.15, -0.15, -0.3865)
        coolTvPong.rotation.y = Math.PI
        this.model.coolerTv.add(coolTvPong)
    }

    addPhysics() {
        const sofaBody = this.physics.createBox({
            name: 'sofa',
            threeObject: this.model.sofa,
            type: 'dynamic',
            mass: 60,
            friction: 1.2,
            restitution: 0.2,
            offset: {x: 0, y: 0, z: 0}
        })

        const tvTableBody = this.physics.createBox({
            name: 'tvTable',
            threeObject: this.model.tvTable,
            type: 'dynamic',
            mass: 10,
            friction: 1.2,
            restitution: 0.2,
            offset: {x: 0, y: 0, z: 0}
        })

        const sadTvBody = this.physics.createBox({
            name: 'sadTv',
            threeObject: this.model.sadTv,
            type: 'dynamic',
            mass: 15,
            friction: 1.2,
            restitution: 0.2,
            offset: {x: 0, y: 0, z: 0}
        })

        const coolerTvBody = this.physics.createBox({
            name: 'coolerTv',
            threeObject: this.model.coolerTv,
            type: 'dynamic',
            mass: 25,
            friction: 1.2,
            restitution: 0.2,
            offset: {x: 0, y: 0, z: 0}
        })
    }

}
export default Pong