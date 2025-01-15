import Game from '../Game.js'

class Test {
    constructor() {
        this.game = new Game()
        this.ressources = this.game.ressources
        this.physics = this.game.physics
        this.scene = this.game.scene
        this.loadTest()
    }

    loadTest() {
        this.model = {}
        this.test = this.ressources.items.test.scene

        for (const children of this.test.children){
            const str = children.name.substring(0, children.name.indexOf('_'))
            if (str) {
                if (this.model[str]) {
                    this.model[str].push(children)
                } else {
                    this.model[str] = [children]
                }
                children.position.y = 1.5
            } else {
                this.model[children.name] = children
                this.model[children.name].position.y = 1.5
            }
        }

        this.scene.add(this.model['CubeGoBRRRR'].at(0))
        this.scene.add(this.model['BIGROUND'])
        this.scene.add(this.model['BIGBALL'])
        this.scene.add(this.model['MONKE'].at(0))

        this.physics.createPhysics({
            name: 'testCube',
            colliderType: 'box',
            threeObject: this.model['CubeGoBRRRR'].at(0),
            type: 'dynamic',
            mass: 10,
            friction: 0.7,
            restitution: 0.3,
            interact: {enabled: true, type: 'take', threeMesh: this.model['CubeGoBRRRR'].at(0), rapierCollider: null, action: null}
        })

        this.physics.createPhysics({
            name: 'testCylinder',
            colliderType: 'cylinder',
            threeObject: this.model['BIGROUND'],
            type: 'dynamic',
            mass: 10,
            friction: 0.7,
            restitution: 0.3,
            interact: {enabled: true, type: 'take', threeMesh: this.model['BIGROUND'], rapierCollider: null, action: null}
        })

        this.physics.createPhysics({
            name: 'testSphere',
            colliderType: 'sphere',
            threeObject: this.model['BIGBALL'],
            type: 'dynamic',
            mass: 10,
            friction: 0.7,
            restitution: 0.3,
            interact: {enabled: true, type: 'take', threeMesh: this.model['BIGBALL'], rapierCollider: null, action: null}
        })

        this.physics.createPhysics({
            name: 'testSuzanne',
            colliderType: 'convexHull',
            threeObject: this.model['MONKE'].at(0),
            type: 'dynamic',
            mass: 10,
            friction: 0.7,
            restitution: 0.3,
            interact: {enabled: true, type: 'take', threeMesh: this.model['MONKE'].at(0), rapierCollider: null, action: null}
        })

        this.stove = this.ressources.items.stove.scene

        this.physics.createPhysics({
            name: 'testCube',
            colliderType: 'box',
            threeObject: this.stove,
            type: 'dynamic',
            mass: 10,
            friction: 0.7,
            restitution: 0.3,
            interact: {enabled: true, type: 'take', threeMesh: this.stove, rapierCollider: null, action: null}
        })

        this.scene.add(this.stove)

    }

    cleanup() {
        this.game = null
        this.ressources = null
        this.physics = null
        this.scene = null

        this.model = null
        this.test = null
    }
}

export default Test