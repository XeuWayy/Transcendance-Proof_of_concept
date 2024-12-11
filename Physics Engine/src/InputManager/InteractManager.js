import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d"

import Game from "../Game/Game.js"

class InteractManager {
    constructor() {
        this.interactList = []
        this.currentlyInteracting = false
        this.currentObject = undefined
        this.load()
    }

    async load() {
        this.game = new Game()

        while (this.game.world === undefined) {
            await new Promise(resolve => setTimeout(resolve, 100))
        }
        
        this.camera = this.game.camera
        this.cameraInstance = this.camera.instance
        this.inputManager = this.camera.fpsCamera.inputManager   
    }

    stopInteraction() {
        this.currentlyInteracting = false

        if (this.currentObject.type === 'zoom') {
            this.currentObject.action()
            this.currentObject = undefined
            return
        }
        if (this.currentObject.type === 'take') {
            this.currentObject.rapierCollider.parent().setBodyType(RAPIER.RigidBodyType.Dynamic)
            this.currentObject = undefined
            return
        }
    }

    checkForInteraction() {
        if (this.currentlyInteracting) {
            this.currentlyInteracting = false
            this.stopInteraction()
            return
        }
        const rayOrigin = this.cameraInstance.position
        const rayDirection = this.cameraInstance.getWorldDirection(new THREE.Vector3())
        const rayLength = 2.5

        const ray = new RAPIER.Ray(rayOrigin, rayDirection)
        this.game.physics.world.intersectionsWithRay(ray, rayLength, true, (object) => {
            const find = this.interactList.find(interact => interact.rapierCollider.handle === object.collider.handle)

            if (find && !this.currentlyInteracting) {
                this.currentlyInteracting = true
                this.currentObject = find
                if (find.type === 'zoom') {
                    find.action()
                }
            }
        });
    }

    update () {
        const inputs = this.inputManager.getInputs();

        if (inputs.interact.pressed) {
            this.checkForInteraction();
        }

        if (this.currentlyInteracting && this.currentObject.type === 'take') {
        
            this.currentObject.rapierCollider.parent().setBodyType(RAPIER.RigidBodyType.Fixed)

            const offset = new THREE.Vector3(2, 0, 2)
            const cameraPosition = this.cameraInstance.position.add(offset)
            const cameraDirection = this.cameraInstance.getWorldDirection(new THREE.Vector3())

            this.currentObject.rapierCollider.parent().setTranslation(cameraPosition, true)
        }
    }
}

export default InteractManager