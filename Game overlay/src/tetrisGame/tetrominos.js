import TetrisGame from "./tetris"

class Tetrominos {
    constructor() {
        this.Tetris = new TetrisGame()
    }

    moveTetromino(deltaX, deltaY) {
        if (!this.checkCollision(deltaX, deltaY)) {
            this.Tetris.currentTetrominos.currentPosition.x += deltaX
            this.Tetris.currentTetrominos.currentPosition.y += deltaY
        } else if (deltaY === 1) {
            this.placeTetrominos()
        }
    }

    rotateMatrix(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse())
    }

    rotateTetromino() {
        const originalForm = this.Tetris.currentTetrominos.tetrominos.form
        this.Tetris.currentTetrominos.tetrominos.form = this.rotateMatrix(this.Tetris.currentTetrominos.tetrominos.form)

        if (this.checkCollision(0, 0)) {
            if (!this.checkCollision(-1, 0)) {
                this.Tetris.currentTetrominos.currentPosition.x -= 1
            }
            else if (!this.checkCollision(1, 0)) {
                this.Tetris.currentTetrominos.currentPosition.x += 1
            }
            else {
                this.Tetris.currentTetrominos.tetrominos.form = originalForm
            }
        }
    }

    checkCollision(offsetX, offsetY) {
        const { form } = this.Tetris.currentTetrominos.tetrominos
        const posX = this.Tetris.currentTetrominos.currentPosition.x + offsetX
        const posY = this.Tetris.currentTetrominos.currentPosition.y + offsetY

        if (!this.Tetris.gameGrid[0].every(element => element === 0) || 
            !this.Tetris.gameGrid[1].every(element => element === 0)) {
            return true
        }

        for (let y = 0; y < form.length; y++) {
            for (let x = 0; x < form[y].length; x++) {
                if (form[y][x] !== 0) {
                    const newX = posX + x
                    const newY = posY + y

                    if (
                        newX < 0 ||
                        newX >= this.Tetris.gridWidth ||
                        newY >= this.Tetris.gridHeight ||
                        (newY >= 0 && this.Tetris.gameGrid[newY][newX] !== 0)
                    ) {
                        return true
                    }
                }
            }
        }
        return false
    }

    placeTetrominos() {
        const { form, colorId } = this.Tetris.currentTetrominos.tetrominos
        const posX = this.Tetris.currentTetrominos.currentPosition.x
        let posY = this.Tetris.currentTetrominos.currentPosition.y

        form.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    const gridX = posX + x
                    const gridY = posY + y
                    if (gridY >= 0 && gridY < this.Tetris.gridHeight && 
                        gridX >= 0 && gridX < this.Tetris.gridWidth) {
                        this.Tetris.gameGrid[gridY][gridX] = colorId
                    }
                }
            })
        })

        if(form.length === 2) {
            posY += 1
        }
        const dropType = (this.Tetris.isSoftDropping ? 2 : 1)
        const rainbowMeter = this.Tetris.rainbowMeter.multiplier + 1
        this.Tetris.lastPieceScore = dropType * Math.min(rainbowMeter * (this.Tetris.rainbowMeter.multiplier + this.Tetris.gridHeight - posY), 250)
        this.Tetris.score += this.Tetris.lastPieceScore
        this.Tetris.lastActionTimestamp = Date.now()

        this.clearLines()
        this.Tetris.Randomizer.spawnTetrominos()
    }

    hardDropTetrominos() {
        while(!this.checkCollision(0, 1)) {
            this.Tetris.currentTetrominos.currentPosition.y += 1
        }
        this.placeTetrominos()
    }

    moveTetrominosDown() {
        if (!this.checkCollision(0, 1)) {
            this.Tetris.currentTetrominos.currentPosition.y += 1
        } else {
            this.placeTetrominos()
        }
    }

    clearLines() {
        let cleared = 0

        for (let y = this.Tetris.gridHeight - 1; y >= 0; y--) {
            if (this.Tetris.gameGrid[y].every(cell => cell !== 0)) {
                this.Tetris.gameGrid.splice(y, 1)
                this.Tetris.gameGrid.unshift(Array(this.Tetris.gridWidth).fill(0))
                cleared++
                y++
            }
        }
        this.Tetris.lastClearAction = this.Tetris.lineClearedScore[cleared]
        this.Tetris.score += this.Tetris.lineClearedScore[cleared]
        this.Tetris.linesCleared += cleared
        this.Tetris.level = Math.floor(this.Tetris.linesCleared / 10) + 1
        this.Tetris.rainbowMeter.multiplier = Math.floor(this.Tetris.linesCleared / 6)
    }
}

export default Tetrominos