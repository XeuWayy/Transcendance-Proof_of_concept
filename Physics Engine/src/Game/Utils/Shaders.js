import {cameraProjectionMatrix, distance, float, Fn, mix, normalGeometry, oneMinus, positionGeometry, texture, uv, vec2, vec3, vec4, modelViewMatrix, mul, step, abs,} from "three/tsl"
import {Color} from "three"

class Shaders {
    constructor() {

    }

    crtShader(videoTexture, mixWhite = false) {
        return Fn(() => {
            const offset = 0.0025
            const scanlineFrequency = 800.0

            const scanline = uv().y.mul(scanlineFrequency).sin().mul(0.06)
            const brightness = float(1.0).sub(scanline)

            const baseColor = texture(videoTexture).mul(vec4(brightness, brightness, brightness, 1.0))

            const offsetVec = vec2(offset, 0.0)

            baseColor.r = texture(videoTexture, uv().sub(offsetVec)).r
            baseColor.b = texture(videoTexture, uv().add(offsetVec)).b
            if (mixWhite){
                baseColor.rgb = mix(baseColor, vec3(1.0), 0.01)
            }
            return baseColor
        })()
    }

    curveFlatPlane(curvatureRatio = 0) {
        return Fn(() => {
            const centerOffPlane = distance(uv(), vec2(0.5))

            const curvature = float(curvatureRatio).mul(oneMinus(mul(centerOffPlane, centerOffPlane)))
            const newPosition = positionGeometry.add(normalGeometry.mul(curvature))

            return cameraProjectionMatrix.mul(modelViewMatrix).mul(vec4(newPosition, 1.0))
        })()
    }

    fragmentCrosshair() {
        return Fn(() =>{

            const mainColor = new Color(0.92, 0.04, 0.80)
            const borderColor = new Color(0, 0, 0)
            const opacity = 1.0
            const thickness = 0.0025
            const height = 0.004
            const offset = 0
            const border = 0.001

            const uvOffset = abs(uv().sub(0.5))

            const horizontalLine = step(uvOffset.x, thickness).mul(
                step(uvOffset.y, float(height).add(offset)).mul(
                    step(offset, uvOffset.y))
            )

            const verticalLine = step(uvOffset.y, thickness).mul(
                step(uvOffset.x, float(height).add(offset)).mul(
                    step(offset, uvOffset.x))
            )

            const outerShape = horizontalLine.add(verticalLine)

            const thicknessBorder = float(thickness).sub(border)
            const heightOffsetBorder = float(height).add(offset).sub(border)
            const offsetBorder = float(offset).add(border)

            const horizontalLineInner = step(uvOffset.x, thicknessBorder).mul(
                step(uvOffset.y, heightOffsetBorder).mul(
                    step(offsetBorder, uvOffset.y))
            )

            const verticalLineInner = step(uvOffset.y, thicknessBorder).mul(
                step(uvOffset.x, heightOffsetBorder).mul(
                    step(offsetBorder, uvOffset.x))
            )

            const innerShape = horizontalLineInner.add(verticalLineInner)

            return vec4(
                mix(borderColor, mainColor, innerShape),
                outerShape.mul(opacity)
            )
        })()
    }
}

export default Shaders