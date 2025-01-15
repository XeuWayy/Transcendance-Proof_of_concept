import EventEmitter from "./Utils/EventEmitter.js"

class Sizes extends EventEmitter{
    constructor() {
        super()
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        this.onResizeBind = this.onResize.bind(this)

        window.addEventListener('resize', this.onResizeBind)

    }

    onResize() {
        // Update sizes
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        // Update game
        this.trigger('resize')
    }

    cleanup() {
        window.removeEventListener('resize', this.onResizeBind)
    }
}
export default Sizes