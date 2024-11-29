import TetrisGame from "./tetris"

class Input {
    constructor() {
        this.Tetris = new TetrisGame()

        // Key management
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)

        this.input = {
            DelayedAutoShift: {
                delay: 150,
                speed: 65
            },
            keys: {
                down: {pressed: false, startTime: 0, lastRepeat: 0},
                left: {pressed: false, startTime: 0, lastRepeat: 0},
                right: {pressed: false, startTime: 0, lastRepeat: 0}
            }
        }
        this.bindStartEvent()
    }

    bindStartEvent() {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Enter') {
                if (this.Tetris.gameState === 'WAITING' || this.Tetris.gameState === 'GAME_OVER') {
                    this.Tetris.startNewGame()
                }
            }
        })
    }

    updateMovement() {
        const now = Date.now()

        Object.entries(this.input.keys).forEach(([direction, state]) => {

            if (state.pressed) {
                const timeSinceStart = now - state.startTime
                const timeSinceRepeat = now - state.lastRepeat

                if (timeSinceStart >= this.input.DelayedAutoShift.delay && 
                    timeSinceRepeat >= this.input.DelayedAutoShift.speed) {
                    
                    switch(direction) {
                        case 'left':
                            this.Tetris.Tetrominos.moveTetromino(-1, 0)
                            break
                        case 'right':
                            this.Tetris.Tetrominos.moveTetromino(1, 0)
                            break
                        case 'down':
                            this.Tetris.Tetrominos.moveTetromino(0, 1)
                            break
                    }
                    state.lastRepeat = now
                }
            }
        })
    }

    handleKeyDown(event) {
        this.Tetris.isSoftDropping = false
        const now = Date.now()

        switch (event.code) {
            case 'ArrowLeft':
                if (!this.input.keys.left.pressed) {
                    this.input.keys.left.pressed = true
                    this.Tetris.Tetrominos.moveTetromino(-1, 0)
                    this.input.keys.left.startTime = now
                    this.input.keys.left.lastRepeat = now
                    this.input.keys.left.right = false
                }
                break
            case 'ArrowRight':
                if (!this.input.keys.right.pressed) {
                    this.input.keys.right.pressed = true
                    this.Tetris.Tetrominos.moveTetromino(1, 0)
                    this.input.keys.right.startTime = now
                    this.input.keys.right.lastRepeat = now
                    this.input.keys.left.pressed = false
                }
                break
            case 'ArrowDown':
                if (!this.input.keys.down.pressed) {
                    this.Tetris.isSoftDropping = true
                    this.input.keys.down.pressed = true
                    this.Tetris.Tetrominos.moveTetromino(0, 1)
                    this.input.keys.down.startTime = now
                    this.input.keys.down.lastRepeat = now
                }
                break
            case 'ArrowUp':
                this.Tetris.Tetrominos.rotateTetromino()
                break
            case 'Space':
                this.Tetris.isSoftDropping = true
                this.Tetris.Tetrominos.hardDropTetrominos()
                break
        }
    }

    handleKeyUp(event) {
        switch (event.code) {
            case 'ArrowLeft':
                this.input.keys.left.pressed = false
                break
            case 'ArrowRight':
                this.input.keys.right.pressed = false
                break
            case 'ArrowDown':
                this.Tetris.isSoftDropping = false
                this.input.keys.down.pressed = false
                break
            case 'Space':
                this.Tetris.isSoftDropping = false
                break
        }
    }

    bindEvents() {
        if (this.Tetris.gameState !== 'PLAYING') {
            return
        }

        document.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('keyup', this.handleKeyUp)
    }

    unbindEvents() {
        document.removeEventListener('keydown', this.handleKeyDown)
        document.removeEventListener('keyup', this.handleKeyUp)
    }
}

export default Input