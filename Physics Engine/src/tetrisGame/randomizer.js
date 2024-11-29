import TetrisGame from "./tetris";

class Randomizer {
    constructor() {
        this.Tetris = new TetrisGame()
    }

    generateNewBag() {
        this.Tetris.tetrominosBag = ["I", "O", "T", "S", "Z", "J", "L"]
        this.shuffleBag()
    }

    shuffleBag() {
        for (let i = this.Tetris.tetrominosBag.length -1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i+1))
            let k = this.Tetris.tetrominosBag[i]
            this.Tetris.tetrominosBag[i] = this.Tetris.tetrominosBag[j]
            this.Tetris.tetrominosBag[j] = k
        }
    }

    spawnTetrominos() {
        if (this.Tetris.tetrominosBag.length < 4) {
            this.generateNewBag()
        }

        this.Tetris.currentTetrominos = JSON.parse(JSON.stringify(this.Tetris.nextTetrominos))
        this.Tetris.tetrominoStats[this.Tetris.currentTetrominos.tetrominos.id]++
        this.Tetris.tetrominosHistory.push(this.Tetris.currentTetrominos.tetrominos.id)
        this.Tetris.tetrominosHistory.shift()

        for (let i = 0; i < 4; i++) {
            const pickedTetrominos = this.Tetris.tetrominosBag[i]
            if (!this.Tetris.tetrominosHistory.includes(pickedTetrominos) || i === 3) {
                const centeredPosX = Math.floor((10 - this.Tetris.tetrominos[this.Tetris.tetrominosBag[i]].form[0].length) / 2)
                this.Tetris.nextTetrominos = {
                    tetrominos: this.Tetris.tetrominos[pickedTetrominos],
                    currentRotation: 0,
                    currentPosition: { x: centeredPosX, y: 0}
                }
                this.Tetris.tetrominosBag.splice(i, 1)
                break
            }
        }
        if (this.Tetris.Tetrominos.checkCollision(0, 0)) {
            this.Tetris.endGame()
        }
    }
}

export default Randomizer