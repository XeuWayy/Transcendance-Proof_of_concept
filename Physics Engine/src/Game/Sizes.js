import EventEmitter from "./Utils/EventEmitter.js"

class Sizes extends EventEmitter{
    constructor() {
        super()
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        window.addEventListener('resize', () =>
        {
            // Update sizes
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            // Update game
            this.trigger('resize')
        })

    }
}
export default Sizes