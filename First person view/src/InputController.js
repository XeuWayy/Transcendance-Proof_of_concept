class InputController {
    constructor() {
        this.initialize()
    }

    initialize() {
        this.canvas = document.querySelector('canvas.webgl')
        this.current = {
            leftButton: false,
            rightButton: false,
            mouseX: 0,
            mouseY: 0,
            mouseXDelta: 0,
            mouseYDelta: 0
        }
        this.previous = null
        this.keys = {}
        this.previousKeys = {}

        document.addEventListener('mousedown', (event) => this.onMouseDown(event))
        document.addEventListener('mouseup', (event) => this.onMouseUp(event))
        document.addEventListener('click', () => {
            if (!this.current.isLocked) {
                this.canvas.requestPointerLock()
            }
        })

        document.addEventListener('pointerlockchange', () => {
            this.current.isLocked = document.pointerLockElement === this.canvas

            if (!this.current.isLocked) {
                this.current.mouseXDelta = 0
                this.current.mouseYDelta = 0
            }
        })
        document.addEventListener('mousemove', (event) => this.onMouseMove(event))
        document.addEventListener('keydown', (event) => this.onKeyDown(event))
        document.addEventListener('keyup', (event) => this.onKeyUp(event))
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Set what mouse button has been pressed by the user
     * @param event The event listener information
     */
    onMouseDown(event) {
        switch (event.button) {
            case 0:
                this.current.leftButton = true
                break
            case 1:
                this.current.rightButton = true
                break
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Set what mouse button has been released by the user
     * @param event The event listener information
     */
    onMouseUp(event) {
        switch (event.button) {
            case 0:
                this.current.leftButton = false
                break
            case 1:
                this.current.rightButton = false
                break
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Refresh mouse current position on the page
     * @param event The event listener information
     */
    onMouseMove(event) {
        if (this.current.isLocked) {
            this.current.mouseXDelta = event.movementX
            this.current.mouseYDelta = event.movementY

            this.current.mouseX += event.movementX
            this.current.mouseY += event.movementY
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Set a bool to true when user press a key
     * @param event The event listener information
     */
    onKeyDown(event) {
        this.keys[event.key.toLowerCase()] = true
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Set a bool to false when user press a key
     * @param event The event listener information
     */
    onKeyUp(event) {
        this.keys[event.key.toLowerCase()] = false
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Update the class information
     */
    update() {
        this.previous = {...this.current}
        if (this.current.isLocked) {
            this.current.mouseXDelta = 0
            this.current.mouseYDelta = 0
        }
    }
}

export default InputController