class TetrisGame {
    constructor() {
        // Grid
        this.gridHeight = 22
        this.gridWidth = 10
        this.GridBasePos = {x: 131, y: 100}
        this.TetrominosSquareSize = 32
        this.gameGrid = Array.from({ length: this.gridHeight }, () => Array(this.gridWidth).fill(0))
        this.gridColors = ['black', 'cyan', 'yellow', 'purple', 'green', 'red', 'blue', 'orange']

        // Game state
        this.isGameOver = false

        // Game stats
        this.tetrominosFallSpeed = [0, 1000, 871, 759, 662, 578, 505, 441, 386, 337, 294, 256, 223, 193, 167, 144, 124, 106, 90, 50]
        this.lineClearedScore = [0, 50, 150, 400, 900]
        this.score = 0
        this.level = 1
        this.linesCleared = 0
        this.isSoftDropping = false

        // Last action
        this.lastPieceScore = 0
        this.timestamp = Date.now()

        // Rainbow meter
        this.rainbowMeter = {
            multiplier: 0,
            position: {x: 31.25, y: 855.25},
            dimensions: {width: 33.5, height: 73.5}
        }

        // Tetrominos
        this.tetrominos = {
            I: { form: [[1, 1, 1, 1]], id: "I", colorId: 1 },
            O: { form: [[1, 1], [1, 1]], id: "O", colorId: 2 },
            T: { form: [[0, 1, 0], [1, 1, 1]], id: "T", colorId: 3 },
            S: { form: [[0, 1, 1], [1, 1, 0]], id: "S", colorId: 4 },
            Z: { form: [[1, 1, 0], [0, 1, 1]], id: "Z", colorId: 5 },
            J: { form: [[1, 1, 1], [1, 0, 0]], id: "J", colorId: 6 },
            L: { form: [[1, 1, 1], [0, 0, 1]], id: "L", colorId: 7 }
        }
        this.tetrominosHistory = ["Z", "Z", "Z", "Z"]
        this.tetrominosBag = []

        this.canvas = document.getElementById("tetrisCanvas")
        this.canvasContext = this.canvas.getContext("2d")

        this.base_image = new Image()
        this.base_image.src = 'img/tetris_arcade_4x_rework.png'
        this.initNewGame()
    }

    initNewGame() {
        this.generateNewBag()
        this.currentTetrominos = {}
        this.nextTetrominos = {
            tetrominos: this.tetrominos[this.tetrominosBag[0]],
            currentRotation: 0,
            currentPosition: { x: Math.floor((10 - this.tetrominos[this.tetrominosBag[0]].form[0].length) / 2), y: 0}
        }
        this.tetrominosBag.shift()
        this.spawnTetromino()
        this.bindEvents()
    }

    generateNewBag() {
        this.tetrominosBag = ["I", "O", "T", "S", "Z", "J", "L"]
        this.shuffleBag()
    }

    shuffleBag() {
        for (let i = this.tetrominosBag.length -1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1))
            let k = this.tetrominosBag[i]
            this.tetrominosBag[i] = this.tetrominosBag[j]
            this.tetrominosBag[j] = k
        }
    }

    spawnTetromino() {
        if (this.tetrominosBag.length === 0) {
            this.generateNewBag()
        }

        this.currentTetrominos = JSON.parse(JSON.stringify(this.nextTetrominos))
        this.tetrominosHistory.push(this.currentTetrominos.tetrominos.id)
        this.tetrominosHistory.shift()

        const maxPick = 4 < this.tetrominosBag.length ? 4: this.tetrominosBag.length
        for (let i = 0; i < maxPick; i++) {
            const pickedTetrominos = this.tetrominosBag[i]
            if (!this.tetrominosHistory.includes(pickedTetrominos) || i === 3) {
                this.nextTetrominos = {
                    tetrominos: this.tetrominos[pickedTetrominos],
                    currentRotation: 0,
                    currentPosition: { x: Math.floor((10 - this.tetrominos[this.tetrominosBag[0]].form[0].length) / 2), y: 0}
                }
                this.tetrominosBag.splice(i, 1)
                break
            }
        }
        if (this.checkCollision(0, 0)) {
            this.endGame()
        }
    }

    bindEvents() {
        document.addEventListener('keydown', (event) => {
            this.isSoftDropping = false
            switch (event.code) {
                case 'ArrowLeft':
                    this.moveTetromino(-1, 0)
                    break
                case 'ArrowRight':
                    this.moveTetromino(1, 0)
                    break
                case 'ArrowDown':
                    this.isSoftDropping = true
                    this.moveTetromino(0, 1)
                    break
                case 'ArrowUp':
                    this.rotateTetromino()
                    break
                case 'Space':
                    this.isSoftDropping = true
                    this.hardDropTetrominos()
                    break
            }
        })

        document.addEventListener('keyup', (event) => {
            if (event.code === 'ArrowDown' || event.code === 'Space') {
                this.isSoftDropping = false
            }
        })
    }

    moveTetromino(deltaX, deltaY) {
        if (!this.checkCollision(deltaX, deltaY)) {
            this.currentTetrominos.currentPosition.x += deltaX
            this.currentTetrominos.currentPosition.y += deltaY
            this.update()
        } else if (deltaY === 1) {
            this.placeTetrominos()
        }
    }

    rotateMatrix(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse())
    }

    rotateTetromino() {
        const originalForm = this.currentTetrominos.tetrominos.form
        this.currentTetrominos.tetrominos.form = this.rotateMatrix(this.currentTetrominos.tetrominos.form)

        if (this.checkCollision(0, 0)) {
            if (!this.checkCollision(-1, 0)) {
                this.currentTetrominos.currentPosition.x -= 1
            }
            else if (!this.checkCollision(1, 0)) {
                this.currentTetrominos.currentPosition.x += 1
            }
            else {
                this.currentTetrominos.tetrominos.form = originalForm
            }
        }
        this.update()
    }

    hardDropTetrominos() {
        while(!this.checkCollision(0, 1)) {
            this.currentTetrominos.currentPosition.y += 1
        }
        this.placeTetrominos()
    }

    checkCollision(offsetX, offsetY) {
        const { form } = this.currentTetrominos.tetrominos
        const posX = this.currentTetrominos.currentPosition.x + offsetX
        const posY = this.currentTetrominos.currentPosition.y + offsetY

        if (!this.gameGrid[0].every(element => element === 0) || !this.gameGrid[1].every(element => element === 0)) {
            return true
        }

        for (let y = 0; y < form.length; y++) {
            for (let x = 0; x < form[y].length; x++) {
                if (form[y][x] !== 0) {
                    const newX = posX + x
                    const newY = posY + y
                    if (
                        newX < 0 ||
                        newX >= this.gridWidth ||
                        newY >= this.gridHeight ||
                        (newY >= 0 && this.gameGrid[newY][newX] !== 0)
                    ) {
                        return true
                    }
                }
            }
        }
        return false
    }

    placeTetrominos() {
        const { form, colorId } = this.currentTetrominos.tetrominos
        const posX = this.currentTetrominos.currentPosition.x
        let posY = this.currentTetrominos.currentPosition.y

        form.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    const gridX = posX + x
                    const gridY = posY + y
                    if (gridY >= 0 && gridY < this.gridHeight && gridX >= 0 && gridX < this.gridWidth) {
                        this.gameGrid[gridY][gridX] = colorId
                    }
                }
            })
        })

        if(form.length === 2) {
            posY += 1
        }
        const dropType = (this.isSoftDropping ? 2 : 1)
        const rainbowMeter = this.rainbowMeter.multiplier + 1
        this.lastPieceScore = dropType * Math.min(rainbowMeter * (this.rainbowMeter.multiplier + this.gridHeight - posY), 250)
        this.score += this.lastPieceScore

        this.clearLines()
        this.spawnTetromino()
    }

    clearLines() {
        let cleared = 0

        for (let y = this.gridHeight - 1; y >= 0; y--) {
            if (this.gameGrid[y].every(cell => cell !== 0)) {
                this.gameGrid.splice(y, 1)
                this.gameGrid.unshift(Array(this.gridWidth).fill(0))
                cleared++
                y++
            }
        }
        this.score += this.lineClearedScore[cleared]
        this.linesCleared += cleared
        this.level = Math.max(1, Math.floor(this.linesCleared / 10))
        this.rainbowMeter.multiplier = Math.floor(this.linesCleared / 6)
    }

    moveTetrominosDown() {
        if (!this.checkCollision(0, 1)) {
            this.currentTetrominos.currentPosition.y += 1
        } else {
            this.placeTetrominos()
        }
    }

    drawGrid() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.canvasContext.fillStyle = "black"
        this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)
        this.canvasContext.drawImage(this.base_image, 0, 0)

        // TEMP FIX
        this.canvasContext.fillRect(this.GridBasePos.x, this.GridBasePos.y, this.gridWidth * 32, this.gridHeight * 32)

        this.gameGrid.forEach((row, y) => {
            if(y > 1) {
                row.forEach((cell, x) => {
                    this.canvasContext.fillStyle = this.gridColors[cell]
                    this.canvasContext.fillRect(x * this.TetrominosSquareSize + this.GridBasePos.x, y * this.TetrominosSquareSize + this.GridBasePos.y, 30, 30)
                    this.canvasContext.strokeStyle = "#3b3b3b"
                    this.canvasContext.strokeRect(x * this.TetrominosSquareSize + this.GridBasePos.x, y * this.TetrominosSquareSize + this.GridBasePos.y, 30, 30)
                })
            }
        })
    }

    drawNextTetrominos() {
        const offsetX = 30 + this.nextTetrominos.currentPosition.x
        const offsetY = 96

        this.canvasContext.clearRect(30, offsetY , 32 * 4, 32 * 2)
        this.canvasContext.fillStyle = 'black'
        this.canvasContext.fillRect(30, offsetY , 32 * 4, 32 * 2)

        this.nextTetrominos.tetrominos.form.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    this.canvasContext.fillStyle = this.gridColors[this.nextTetrominos.tetrominos.colorId]
                    this.canvasContext.fillRect(offsetX + x * this.TetrominosSquareSize, offsetY + y * this.TetrominosSquareSize, 30, 30)
                    this.canvasContext.strokeRect(offsetX + x * this.TetrominosSquareSize, offsetY + y * this.TetrominosSquareSize, 30, 30)
                }
            })
        })
    }

    drawTetrominos() {
        const { form, colorId } = this.currentTetrominos.tetrominos
        const posX = this.currentTetrominos.currentPosition.x
        const posY = this.currentTetrominos.currentPosition.y

        form.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    const drawX = (posX + x) * this.TetrominosSquareSize + this.GridBasePos.x
                    const drawY = (posY + y) * this.TetrominosSquareSize + this.GridBasePos.y
                    this.canvasContext.fillStyle = this.gridColors[colorId]
                    this.canvasContext.fillRect(drawX, drawY, 30, 30)
                    this.canvasContext.strokeRect(drawX, drawY, 30, 30)
                }
            })
        })
    }

    drawRainbowMeter () {
        this.rainbowMeterGradient = this.canvasContext.createLinearGradient(
            this.rainbowMeter.position.x,
            this.rainbowMeter.position.y + this.rainbowMeter.dimensions.height,
            this.rainbowMeter.position.x,
            this.rainbowMeter.position.y)

        this.rainbowMeterGradient.addColorStop(0, "red")
        this.rainbowMeterGradient.addColorStop(0.16, "orange")
        this.rainbowMeterGradient.addColorStop(0.32, "yellow")
        this.rainbowMeterGradient.addColorStop(0.48, "green")
        this.rainbowMeterGradient.addColorStop(0.64, "blue")
        this.rainbowMeterGradient.addColorStop(0.8, "indigo")
        this.rainbowMeterGradient.addColorStop(1, "violet")

        const currentMeterLevel = Math.min(this.rainbowMeter.multiplier, 25)
        const filledHeight = (currentMeterLevel / 25) * this.rainbowMeter.dimensions.height

        this.canvasContext.fillStyle = this.rainbowMeterGradient
        this.canvasContext.fillRect(
            this.rainbowMeter.position.x,
            this.rainbowMeter.position.y + this.rainbowMeter.dimensions.height - filledHeight,
            this.rainbowMeter.dimensions.width,
            filledHeight)
    }

    drawScore() {
        const offsetX = 275
        const offsetY = 895
        this.canvasContext.fillStyle = '#FF0000'
        this.canvasContext.font = 'bold 40px Tetris'
        this.canvasContext.fillText(`${this.score}`, offsetX, offsetY)
    }

    drawLevel() {
        const offsetX = 690
        const offsetY = 863
        this.canvasContext.fillStyle = '#4546a3'
        this.canvasContext.font = 'bold 40px Tetris'
        this.canvasContext.fillText(`${this.level}`, offsetX, offsetY)
    }

    drawLinesCleared() {
        const offsetX = 275
        const offsetY = 927
        this.canvasContext.fillStyle = '#FF0000'
        this.canvasContext.font = 'bold 40px Tetris'
        this.canvasContext.fillText(`${this.linesCleared}`, offsetX, offsetY)
    }

    drawLastAction() {
        const timestamp = Date.now()
        const delta = timestamp - this.timestamp

        const offsetX = 535
        const offsetY = 507
        this.canvasContext.fillStyle = '#00FF00'
        this.canvasContext.font = 'bold 38px Tetris'
        this.canvasContext.fillText(`PIECE SCORE`, offsetX, offsetY)
        this.canvasContext.fillText(`+ ${this.lastPieceScore}`, offsetX + 115 - (this.lastPieceScore.toString().length * 10), offsetY + 40)
    }

    update() {
        if (this.isGameOver) {
            return
        }
        this.drawGrid()
        this.drawNextTetrominos()
        this.drawTetrominos()
        this.drawRainbowMeter()
        this.drawScore()
        this.drawLevel()
        this.drawLinesCleared()
        this.drawLastAction()
    }

    endGame() {
        this.isGameOver = true
        cancelAnimationFrame(this.animationId)
        alert("Game Over!")
    }
}

let game
let lastTime = 0
const gameLoop = (timestamp) => {
    if (!game.isGameOver) {
        if (timestamp - lastTime > game.tetrominosFallSpeed[game.level]) {
            game.moveTetrominosDown()
            lastTime = timestamp
        }
        game.update()
        game.animationId = requestAnimationFrame(gameLoop)
    }
}

const startGame = () => {
    game = new TetrisGame()
    gameLoop()
}

addEventListener("DOMContentLoaded", () => startGame())
