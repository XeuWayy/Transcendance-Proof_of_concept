import * as THREE from 'three'

import Game from "../Game.js"
import flatCrtVertex from "../../shaders/flatCrt/vertex.glsl"
import flatCrtFragment from "../../shaders/flatCrt/fragment.glsl"

class Tetris {
    constructor() {
        this.game = new Game()
        this.canvas = this.game.canvas
        this.scene = this.game.scene
        this.ressources = this.game.ressources
        this.camera = this.game.camera
        this.physics = this.game.physics
        this.objectsToIntersect = []

        this.setModel()
       this.addArcadeToPhysics()
        this.setTetrisGame()
        window.addEventListener('keydown', (event) => {
            if (event.code === 'KeyE') {
                const cameraDirection = this.camera.instance.getWorldDirection(new THREE.Vector3())

                const raycast = new THREE.Raycaster
                raycast.camera = this.camera
                raycast.far = 1.5
                raycast.set(this.camera.instance.position, cameraDirection)
                const intersects = raycast.intersectObjects(this.objectsToIntersect, true)
                if (intersects.length > 0) {
                    this.centerCameraOnArcade()
                }
            }
        })
    }

    setModel() {
        this.tetrisMachine = this.ressources.items.tetrisMachine.scene
        this.tetrisMachine.rotation.y = -Math.PI * 0.5

        this.tetrisMachine.position.set(-15.032, 1.05, -26.57)
        this.tetrisMachine.scale.set(0.030, 0.030, 0.030)
        this.objectsToIntersect.push(this.tetrisMachine)
        this.scene.add(this.tetrisMachine)
    }

    setTetrisGame() {
        this.tetrisCanvas = document.getElementById('tetrisCanvas')
        this.canvasTexture = new THREE.CanvasTexture(this.tetrisCanvas)
        this.canvasTexture.colorSpace = THREE.SRGBColorSpace

        const tetrisGame = new THREE.Mesh(
            new THREE.PlaneGeometry(0.475, 0.352, 128, 128),
            new THREE.ShaderMaterial({
                uniforms: {
                    videoTexture: { value: this.canvasTexture }
                },
                vertexShader: flatCrtVertex,
                fragmentShader: flatCrtFragment,
                side: THREE.DoubleSide
            })
        )
        tetrisGame.position.set(-15.034, 1.553, -26.474)
        tetrisGame.rotation.x = -Math.PI * 0.15
        this.objectsToIntersect.push(tetrisGame)
        this.scene.add(tetrisGame)
    }

    addArcadeToPhysics() {
        const tetrisBody = this.physics.createBox({
            name: 'tetrisMachine',
            threeObject: this.tetrisMachine,
            type: 'fixed',
            mass: 100,
            friction: 0.7,
            restitution: 0,
            offset: {x: 0, y: 0, z: 0}
        })
    }

    centerCameraOnArcade() {
        if (!this.camera.fpsCamera.isInteractingWithArcade) {
            this.camera.fpsCamera.isInteractingWithArcade= true
            this.camera.instance.position.set(-15.03, 1.7, -26.15)
            this.camera.instance.rotation.set(-0.4940008349279439, -0.0017608863389264688, -0.0009483038705260853)
        }  else {
            this.camera.fpsCamera.isInteractingWithArcade = false
            this.camera.instance.position.set(-15, 1.7, -25.15)
        }
    }

    update() {
        this.canvasTexture.needsUpdate = true
    }
}

export default Tetris