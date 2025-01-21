import {LOD} from 'three/webgpu'

import Game from "../Game.js"


class KidsPlayground {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.ressources = this.game.ressources
        this.physics = this.game.physics

        this.distance = [0, 20, 40, 70]

        this.loadModel()
    }

    async loadModel(){
        this.models = {}

        this.models.swing = this.ressources.items.swing.file.scene
        this.models.swing.position.y = 10

        //this.scene.add(this.models.swing)

        this.models.house = this.ressources.items.house.file.scene
        this.models.house.position.x = 20
        //this.generatePhysicsConfig(this.models.house)
        const json = this.ressources.items.house.json


        this.models.house.children[0].children.forEach((child) => {
            if (child.name.includes('_LOD_') || (!child.name.includes('_LOD') && !child.isMesh) || (!child.name.includes('_LOD') && child.isMesh && !child.parent.isGroup)) {
                const jsonChild = json[child.name]
                if (jsonChild) {
                    if (child.name.includes('_LOD')){
                        const lod = new LOD()
                        const length = child.children.length
                        for (let i = 0; i < length; i++) {
                            lod.addLevel(child.children[0], this.distance[i], 0.05)
                        }
                        lod.position.copy(child.position)
                        lod.rotation.copy(child.rotation)
                        lod.quaternion.copy(child.quaternion)
                        lod.scale.copy(child.scale)
                        child = lod
                    }

                    this.scene.add(child)

                    this.physics.createPhysics({
                        name: jsonChild.name,
                        colliderType: jsonChild.colliderType,
                        threeObject: child,
                        type: jsonChild.type,
                        mass: jsonChild.mass,
                        friction: jsonChild.friction,
                        restitution: jsonChild.restitution,
                        interact: jsonChild.interact
                    })
                }
            }
        })
    }

    cleanup() {
        for (const properties in this) {
            this[properties] = null
        }
    }

    generatePhysicsConfig(model) {
        const config = {}
        console.log(model);
        model.traverse(child => {
            if (child.name.includes('_LOD_') || (!child.name.includes('_LOD') && !child.isMesh) || (!child.name.includes('_LOD') && child.isMesh && !child.parent.isGroup)) {
                console.log('hello', child);

                config[child.name] = {
                    name: child.name,
                    colliderType: "box",
                    threeObject: child.name.includes('_LOD_') ? child.children[0].name : child.name,
                    type: "dynamic",
                    mass: 1,
                    friction: 0.5,
                    restitution: 0.1,
                    interact: { enabled: false }
                }
            }
        })
        console.log(JSON.stringify(config, null, 2))
    }
}

export default KidsPlayground