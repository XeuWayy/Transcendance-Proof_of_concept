import {
    cameraProjectionMatrix,
    distance,
    float,
    Fn,
    mix,
    normalGeometry,
    oneMinus,
    positionGeometry,
    texture,
    uv,
    vec2,
    vec3,
    vec4,
    modelViewMatrix,
    mul
} from "three/tsl";

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
}

export default Shaders