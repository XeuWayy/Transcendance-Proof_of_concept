import * as THREE from "three"
import * as RAPIER from "@dimforge/rapier3d"

import Game from "../Game/Game.js"

class InteractManager {
    constructor(cameraClass, inputManagerClass) {
        this.game = new Game()
        this.camera = cameraClass
        this.cameraInstance = this.camera.instance
        this.inputManager = inputManagerClass
    }

    checkForInteraction() {
        const rayOrigin = this.cameraInstance.position
        const rayDirection = this.cameraInstance.getWorldDirection(new THREE.Vector3())
        const rayLength = 2

        const ray = new RAPIER.Ray(rayOrigin, rayDirection)
        this.game.physics.world.intersectionsWithRay(ray, rayLength, true, (collider) => {
            console.log(collider)
        });
    }

    update () {
        const inputs = this.inputManager.getInputs();

        if (inputs.interact.pressed) {
            this.checkForInteraction();
        }
    }
}

export default InteractManager