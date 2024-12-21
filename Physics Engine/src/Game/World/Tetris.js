import * as THREE from 'three/webgpu'

import Game from "../Game.js"

class Tetris {
    constructor() {
        this.game = new Game()
        this.canvas = this.game.canvas
        this.scene = this.game.scene
        this.ressources = this.game.ressources
        this.camera = this.game.camera
        this.physics = this.game.physics
        this.shaders = this.game.shaders
        this.player =  this.game.world.player

        this.objectsToIntersect = []

        this.isInteractingWithArcade = false

        this.originalCameraPosition = new THREE.Vector3()
        this.originalCameraRotation = new THREE.Quaternion()

        this.cameraAnimationProgress = 1
        this.cameraStartPosition = new THREE.Vector3()
        this.cameraEndPosition = new THREE.Vector3()
        this.cameraStartRotation = new THREE.Quaternion()
        this.cameraEndRotation = new THREE.Quaternion()
        
        this.setModel()
        this.addArcadeToPhysics()
        this.setTetrisGame()
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

        const tetrisMaterial = new THREE.MeshBasicNodeMaterial({
            side: THREE.FrontSide
        })

        tetrisMaterial.fragmentNode = this.shaders.crtShader(this.canvasTexture, true)

        const tetrisGame = new THREE.Mesh(
            new THREE.PlaneGeometry(0.475, 0.352, 128, 128),
            tetrisMaterial
        )
        tetrisGame.position.set(-15.034, 1.553, -26.474)
        tetrisGame.rotation.x = -Math.PI * 0.15
        this.objectsToIntersect.push(tetrisGame)
        this.scene.add(tetrisGame)
    }

    addArcadeToPhysics() {
        this.physics.createPhysics({
            name: 'tetrisMachine',
            colliderType: 'box',
            threeObject: this.tetrisMachine,
            type: 'fixed',
            mass: 100,
            friction: 0.7,
            restitution: 0,
            interact: {enabled: true, type: 'zoom', threeObject: this.tetrisMachine, rapierCollider: null, action: this.centerCameraOnArcade.bind(this)}
        })
    }

    centerCameraOnArcade() {
        const camera = this.camera.instance

        if (!this.isInteractingWithArcade) {
            this.isInteractingWithArcade = true

            this.player.cameraControlEnabled = false

            this.originalCameraPosition.copy(camera.position)
            this.originalCameraRotation.copy(camera.quaternion)

            this.cameraStartPosition.copy(camera.position)
            this.cameraEndPosition.set(-15.03, 1.7, -26.15)

            this.cameraStartRotation.copy(camera.quaternion)
            this.cameraEndRotation.setFromEuler(new THREE.Euler(
                -0.4940008349279439,
                -0.0017608863389264688,
                -0.0009483038705260853
            ))

            this.cameraAnimationProgress = 0
        } else {
            this.isInteractingWithArcade = false

            this.player.cameraControlEnabled = false

            this.cameraStartPosition.copy(camera.position)
            this.cameraEndPosition.copy(this.originalCameraPosition)

            this.cameraStartRotation.copy(camera.quaternion)
            this.cameraEndRotation.copy(this.originalCameraRotation)

            this.cameraAnimationProgress = 0
        }
    }

    update() {
        this.canvasTexture.needsUpdate = true

        if (this.cameraAnimationProgress < 1) {
            this.cameraAnimationProgress += 0.02

            const t = THREE.MathUtils.smoothstep(this.cameraAnimationProgress, 0, 1)
            const camera = this.camera.instance

            camera.position.lerpVectors(this.cameraStartPosition, this.cameraEndPosition, t)
            camera.quaternion.slerpQuaternions(this.cameraStartRotation, this.cameraEndRotation, t)

            if (this.cameraAnimationProgress >= 1 && !this.isInteractingWithArcade) {
                this.player.cameraControlEnabled = true
            }
        }
    }
}

export default Tetris