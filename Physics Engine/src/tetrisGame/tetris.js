import Renderer from "./renderer.js"
import Input from "./input.js"
import Tetrominos from "./tetrominos.js"
import Randomizer from "./randomizer.js"

let instance

class TetrisGame {
    constructor() {
        if (instance) {
            return instance
        }
        instance = this

        this.canvas = document.getElementById("tetrisCanvas")
        this.canvasContext = this.canvas.getContext("2d")

        this.base_image = new Image()
        this.base_image.src = 'img/tetris_arcade_4x_rework.png'

        this.base_image.onload = () => {
            this.update()
        }

        // Grid
        this.gridHeight = 22
        this.gridWidth = 10
        this.gameGrid = Array.from({ length: this.gridHeight }, () => Array(this.gridWidth).fill(0))

        // Game state
        this.gameState = 'WAITING'

        // Game stats
        this.tetrominosFallSpeed = [0, 1000, 800, 650, 540, 460, 400, 350, 310, 280, 250, 220, 190, 160, 130, 100, 80, 60, 40, 20]
        this.lineClearedScore = [0, 50, 150, 400, 900]
        this.tetrominoStats = {I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0}
        this.growthFactor = 5
        this.highScore = 0
        this.score = 0
        this.level = 1
        this.linesCleared = 0
        this.isSoftDropping = false

        // Last action
        this.lastPieceScore = 0
        this.lastClearAction = 0
        this.lastActionTimestamp = Date.now()

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

        this.Renderer = new Renderer()
        this.Input = new Input()
        this.Tetrominos = new Tetrominos()
        this.Randomizer = new Randomizer()
    }

    startNewGame() {
        this.gameState = 'PLAYING'
        this.score = 0
        this.level = 1
        this.linesCleared = 0
        this.lastPieceScore = 0
        this.lastClearAction = 0
        this.lastActionTimestamp = Date.now()
        this.rainbowMeter.multiplier = 0
        this.tetrominoStats = {I: 0, O: 0, T: 0, S: 0, Z: 0, J: 0, L: 0}
        this.gameGrid = Array.from({ length: this.gridHeight }, () => Array(this.gridWidth).fill(0))

        this.initNewGame()

        this.animationId = requestAnimationFrame(gameLoop)
    }

    initNewGame() {
        this.Randomizer.generateNewBag()
        this.currentTetrominos = {}
        const centeredPosX = Math.floor((10 - this.tetrominos[this.tetrominosBag[0]].form[0].length) / 2)
        this.nextTetrominos = {
            tetrominos: this.tetrominos[this.tetrominosBag[0]],
            currentRotation: 0,
            currentPosition: { x: centeredPosX, y: 0}
        }
        this.tetrominosBag.shift()
        this.Randomizer.spawnTetrominos()
        this.Input.bindEvents()
    }

    update() {
        if (game.gameState === 'PLAYING') {
            this.Input.updateMovement()
        }
        this.Renderer.update()
    }

    endGame() {
        this.gameState = 'GAME_OVER'
        this.Input.unbindEvents()
        if (this.score > this.highScore) {
            this.highScore = this.score
        }
        this.update()
        cancelAnimationFrame(this.animationId)
    }
}
export default TetrisGame

let game
let lastTime = 0
const gameLoop = (timestamp) => {
    if (game.gameState === 'PLAYING') {
        if (timestamp - lastTime > game.tetrominosFallSpeed[game.level]) {
            game.Tetrominos.moveTetrominosDown()
            lastTime = timestamp
        }
        game.animationId = requestAnimationFrame(gameLoop)
    }
    game.update()
}

const startGame = () => {
    game = new TetrisGame()
    gameLoop()
}

addEventListener("DOMContentLoaded", () => startGame())