import EventEmitter from "./EventEmitter.js"

class Time extends EventEmitter{
    constructor() {
        super()

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16

        requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick () {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        requestAnimationFrame(() => {
            this.tick()
        })
    }
}

export default Time