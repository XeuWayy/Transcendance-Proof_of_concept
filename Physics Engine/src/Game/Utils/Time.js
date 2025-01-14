import EventEmitter from "./EventEmitter.js"

class Time extends EventEmitter{
    constructor() {
        super()

        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        this.deltaInSecond = this.delta * 0.001

        requestAnimationFrame(() => {
            this.tick()
        })
    }

    tick () {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.deltaInSecond = this.delta * 0.001
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        this.request = requestAnimationFrame(() => {
            this.tick()
        })
    }
}

export default Time