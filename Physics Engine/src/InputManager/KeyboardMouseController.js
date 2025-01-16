class KeyboardMouseController {
    constructor() {
        this.initialize()
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Initialize the class && all the event listener
     */
    initialize(){
        this.canvas = document.querySelector('canvas.webgl')
        this.current = {
            leftButton: false,
            rightButton: false,
            mouseX: 0,
            mouseY: 0,
            mouseXDelta: 0,
            mouseYDelta: 0
        }
        this.mouseSensitivity = 0.002
        this.keys = {}

        this.onMouseDownBind = this.onMouseDown.bind(this)
        this.onMouseUpBind = this.onMouseUp.bind(this)
        this.onClickBind = this.onClick.bind(this)
        this.onPointerLockChangeBind = this.onPointerLockChange.bind(this)
        this.onMouseMoveBind = this.onMouseMove.bind(this)
        this.onKeyDownBind = this.onKeyDown.bind(this)
        this.onKeyUpBind = this.onKeyUp.bind(this)

        document.addEventListener('mousedown', this.onMouseDownBind)
        document.addEventListener('mouseup', this.onMouseUpBind)
        document.addEventListener('click', this.onClickBind)

        document.addEventListener('pointerlockchange', this.onPointerLockChangeBind)
        document.addEventListener('mousemove', this.onMouseMoveBind)
        document.addEventListener('keydown', this.onKeyDownBind)
        document.addEventListener('keyup', this.onKeyUpBind)
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
            case 2:
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
            case 2:
                this.current.rightButton = false
                break
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Request pointer lock when user click on game canvas
     * @param event The event listener information
     */
    onClick(event) {
        if (!this.current.isLocked && event.target === this.canvas) {
            this.canvas.requestPointerLock()
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Reset mouse position when user leave the pointer lock
     */
    onPointerLockChange() {
        this.current.isLocked = document.pointerLockElement === this.canvas

        if (!this.current.isLocked) {
            this.current.mouseXDelta = 0
            this.current.mouseYDelta = 0
        }
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Refresh mouse current position on the page
     * @param event The event listener information
     */
    onMouseMove(event) {
        if (this.current.isLocked) {
            this.current.mouseXDelta = event.movementX * this.mouseSensitivity
            this.current.mouseYDelta = event.movementY * this.mouseSensitivity

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
        this.keys[event.code] = true
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Set a bool to false when user press a key
     * @param event The event listener information
     */
    onKeyUp(event) {
        this.keys[event.code] = false
    }

    /**
     * @author Corentin (XeuWayy) Charton
     * @desc Update the class information
     */
    update() {
        if (this.current.isLocked) {
            this.current.mouseXDelta = 0
            this.current.mouseYDelta = 0
        }
    }

    cleanup() {
        document.removeEventListener('mousedown', this.onMouseDownBind)
        document.removeEventListener('mousedown', this.onMouseUpBind)
        document.removeEventListener('click', this.onClickBind)
        document.removeEventListener('pointerlockchange', this.onPointerLockChangeBind)
        document.removeEventListener('mousemove', this.onMouseMoveBind)
        document.removeEventListener('keydown', this.onKeyDownBind)
        document.removeEventListener('keyup', this.onKeyUpBind)

        for (const properties in this) {
            this[properties] = null
        }
    }
}

export default KeyboardMouseController