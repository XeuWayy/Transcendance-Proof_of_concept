import TetrisGame from './tetris.js'

class Renderer {
    constructor() {
        this.Tetris = new TetrisGame()

        // Colors
        this.gridColors = ['#000000', '#00FFFF', '#FFFF00', '#800080', '#00FF00', '#FF0000', '#0000FF', '#FFA500']
        this.lightenGridColors = ['#000000', '#4CFFFF', '#FFFF4C', '#CC4CCC', '#4CFF4C', '#FF4C4C', '#4C4CFF', '#FFF14C']
        this.borderLightenGridColors = ['#000000', '#7FFFFF', '#FFFF7F', '#FF7FFF', '#7FFF7F', '#FF7F7F', '#7F7FFF', '#FFFF7F']
        this.darkenGridColors = ['#000000', '#00B3B3', '#B3B300', '#340034', '#00B300', '#B30000', '#0000B3', '#B35900']
        
        // Grid
        this.GridBasePos = {x: 131, y: 100}
        this.TetrominosSquareSize = 32
    }

    drawTetrominosSquare (posX, posY, colorId) {
        const canvasContext = this.Tetris.canvasContext

        const gradient = canvasContext.createLinearGradient(posX, posY, posX + 30, posY + 30)
        gradient.addColorStop(0, this.gridColors[colorId])
        gradient.addColorStop(0.5, this.lightenGridColors[colorId])
        gradient.addColorStop(1, this.darkenGridColors[colorId])

        canvasContext.fillStyle = gradient
        canvasContext.fillRect(posX, posY, 30, 30)

        canvasContext.strokeStyle = "rgba(0, 0, 0, 0.5)"
        canvasContext.lineWidth = 2
        canvasContext.strokeRect(posX, posY, 30, 30)

        canvasContext.beginPath()
        canvasContext.moveTo(posX, posY + 30)
        canvasContext.lineTo(posX, posY)
        canvasContext.lineTo(posX + 30, posY)
        canvasContext.strokeStyle = this.borderLightenGridColors[colorId]
        canvasContext.stroke()
    }

    drawGrid() {
        const { canvasContext, canvas, gameGrid } = this.Tetris

        canvasContext.clearRect(0, 0, canvas.width, canvas.height)
        canvasContext.fillStyle = "black"
        canvasContext.fillRect(0, 0, canvas.width, canvas.height)
        canvasContext.drawImage(this.Tetris.base_image, 0, 0)
    
        gameGrid.forEach((row, y) => {
            if (y > 1) {
                row.forEach((cell, x) => {
                    if (cell !== 0) {
                        const posX = x * this.TetrominosSquareSize + this.GridBasePos.x
                        const posY = y * this.TetrominosSquareSize + this.GridBasePos.y

                        this.drawTetrominosSquare(posX, posY, cell)
                    }
                })
            }
        })
    }
    
    drawNextTetrominos() {
        const { form, colorId } = this.Tetris.nextTetrominos.tetrominos

        const offsetX = 30 + this.Tetris.nextTetrominos.currentPosition.x
        const offsetY = 96
    
        form.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    const posX = offsetX + x * this.TetrominosSquareSize
                    const posY = offsetY + y * this.TetrominosSquareSize

                    this.drawTetrominosSquare(posX, posY, colorId)
                }
            })
        })
    }

    drawTetrominos() {
        const { form, colorId } = this.Tetris.currentTetrominos.tetrominos

        const posX = this.Tetris.currentTetrominos.currentPosition.x
        const posY = this.Tetris.currentTetrominos.currentPosition.y
    
        form.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell !== 0) {
                    const drawX = (posX + x) * this.TetrominosSquareSize + this.GridBasePos.x
                    const drawY = (posY + y) * this.TetrominosSquareSize + this.GridBasePos.y

                    this.drawTetrominosSquare(drawX, drawY, colorId)
                }
            })
        })
    }
    
    drawRainbowMeter () {
        const canvasContext = this.Tetris.canvasContext
        const rainbowMeter = this.Tetris.rainbowMeter

        this.rainbowMeterGradient = canvasContext.createLinearGradient(
            rainbowMeter.position.x,
            rainbowMeter.position.y + rainbowMeter.dimensions.height,
            rainbowMeter.position.x,
            rainbowMeter.position.y
        )

        this.rainbowMeterGradient.addColorStop(0, "red")
        this.rainbowMeterGradient.addColorStop(0.16, "orange")
        this.rainbowMeterGradient.addColorStop(0.32, "yellow")
        this.rainbowMeterGradient.addColorStop(0.48, "green")
        this.rainbowMeterGradient.addColorStop(0.64, "blue")
        this.rainbowMeterGradient.addColorStop(0.8, "indigo")
        this.rainbowMeterGradient.addColorStop(1, "violet")

        const currentMeterLevel = Math.min(rainbowMeter.multiplier, 25)
        const filledHeight = (currentMeterLevel / 25) * rainbowMeter.dimensions.height

        canvasContext.fillStyle = this.rainbowMeterGradient
        canvasContext.fillRect(
            rainbowMeter.position.x,
            rainbowMeter.position.y + rainbowMeter.dimensions.height - filledHeight,
            rainbowMeter.dimensions.width,
            filledHeight
        )
    }

    drawText(posX, posY, color, font, text) {
        const canvasContext = this.Tetris.canvasContext

        canvasContext.fillStyle = color
        canvasContext.font = font
        canvasContext.fillText(`${text}`, posX, posY)
    }

    drawStats() {
        const {canvasContext, tetrominos} = this.Tetris

        const basePosX = 923
        const basePosY = 750

        const keys = Object.keys(this.Tetris.tetrominoStats)
    
        for (let i = 0; i < keys.length; i++) {
            let barHeight = this.Tetris.tetrominoStats[keys[i]] * this.Tetris.growthFactor
            if (barHeight >= 500) {
                this.Tetris.growthFactor /= 2
            }
    
            if (barHeight > 0) {
            const posX = basePosX + (40 * i)
            const posY = basePosY - (barHeight - 50)
    
            const gradient = canvasContext.createLinearGradient(posX, posY, posX + 30, posY + barHeight)
            gradient.addColorStop(0, this.gridColors[tetrominos[keys[i]].colorId])
            gradient.addColorStop(0.5, this.lightenGridColors[tetrominos[keys[i]].colorId])
            gradient.addColorStop(1, this.darkenGridColors[tetrominos[keys[i]].colorId])
    
            canvasContext.fillStyle = gradient
            canvasContext.fillRect(posX, posY, 30, barHeight)
    
            canvasContext.strokeStyle = "rgba(0, 0, 0, 0.5)"
            canvasContext.lineWidth = 2
            canvasContext.strokeRect(posX, posY, 30, barHeight)
    
            canvasContext.beginPath()
            canvasContext.moveTo(posX, posY + barHeight)
            canvasContext.lineTo(posX, posY)
            canvasContext.lineTo(posX + 30, posY)
            canvasContext.strokeStyle = this.borderLightenGridColors[tetrominos[keys[i]].colorId]
            canvasContext.stroke()
            }
        }
    }

    drawLastAction() {
        if (this.Tetris.lastActionTimestamp && Date.now() - this.Tetris.lastActionTimestamp < 750) {
            this.drawText(535, 507, '#00FF00', 'bold 38px Tetris', 'PIECE SCORE')

            let posX = 650 - (this.Tetris.lastPieceScore.toString().length * 10)
            let posY = 547
            this.drawText(posX, posY, '#00FF00', 'bold 38px Tetris', `+ ${this.Tetris.lastPieceScore}`)

            const lastClearOffset = (this.Tetris.lastClearAction.toString().length * 10)
            const lastClearAction = `+ ${this.Tetris.lastClearAction}`
            switch(this.Tetris.lastClearAction){
                case 900:
                    this.drawText(593, 590, '#FF0000', 'bold 38px Tetris', 'TETRIS')
                    this.drawText(648 - lastClearOffset, 630, '#FF0000', 'bold 38px Tetris', lastClearAction)
                    break
                case 400:
                    this.drawText(597, 590, '#FF00FF', 'bold 38px Tetris', 'TRIPLE')
                    this.drawText(649 - lastClearOffset, 630, '#FF00FF', 'bold 38px Tetris', lastClearAction)
                    break
                case 150:
                    this.drawText(591, 590, '#00FFFF', 'bold 38px Tetris', 'DOUBLE')
                    this.drawText(656 - lastClearOffset, 630, '#00FFFF', 'bold 38px Tetris', lastClearAction)
                    break
                case 50:
                    this.drawText(597, 590, '#FFFF00', 'bold 38px Tetris', 'SINGLE')
                    this.drawText(652 - lastClearOffset, 630, '#FFFF00', 'bold 38px Tetris', lastClearAction)
                    break
                default:
                    break
            }
        }
    }

    drawBannerMessage() {
        const canvasContext = this.Tetris.canvasContext
        
        const posX = 0
        const posY = (this.Tetris.canvas.height * 0.5) - (this.Tetris.canvas.height * 0.10)

        const sizeX = this.Tetris.canvas.width
        const sizeY = this.Tetris.canvas.height * 0.20

        canvasContext.fillStyle = "rgba(0, 0, 0, 0.85)"
        canvasContext.fillRect(posX, posY, sizeX, sizeY)
        canvasContext.fillStyle = '#FF0000'
        canvasContext.font = 'bold 40px Tetris'
        if (this.Tetris.gameState === 'WAITING') {
            canvasContext.fillText('PRESS ENTER TO START', 410, 493)
        } else {
            canvasContext.fillText('GAME OVER', 547, 476)
            canvasContext.fillText('PRESS ENTER TO RESTART', 410, 510)
        }
    }
    update() {
        this.drawGrid()

        if (this.Tetris.gameState === 'PLAYING') {
            this.drawNextTetrominos()
            this.drawTetrominos()
            this.drawRainbowMeter()
            this.drawLastAction()
        } else {
            this.drawBannerMessage()
        }

        if(this.Tetris.gameState !== 'WAITING') {
            this.drawText(275, 895, '#FF0000', 'bold 40px Tetris', this.Tetris.score)
            this.drawText(673 - (this.Tetris.highScore.toString().length * 11), 800, '#4546a3', 'bold 40px Tetris', this.Tetris.highScore)
            this.drawText(690, 863, '#4546a3', 'bold 40px Tetris', this.Tetris.level)
            this.drawText(275, 927, '#FF0000', 'bold 40px Tetris', this.Tetris.linesCleared)
            this.drawStats()
        }
    }
}

export default Renderer