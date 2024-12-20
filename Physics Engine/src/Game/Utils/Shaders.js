import {float, Fn, mix, texture, uv, vec2, vec3,  vec4} from "three/tsl";

class Shaders {
    constructor() {

    }

    flatCrtShader(videoTexture) {
        const crtEffect = Fn(() => {
            const offset = 0.0025
            const scanlineFrequency = 800.0

            const scanline = uv().y.mul(scanlineFrequency).sin().mul(0.06)
            const brightness = float(1.0).sub(scanline)

            const baseColor = texture(videoTexture).mul(vec4(brightness, brightness, brightness, 1.0))

            const offsetVec = vec2(offset, 0.0)

            baseColor.r = texture(videoTexture, uv().sub(offsetVec)).r
            baseColor.b = texture(videoTexture, uv().add(offsetVec)).b

            baseColor.rgb = mix(baseColor, vec3(1.0), 0.01)
            return baseColor
        })()
        return crtEffect
    }
}

export default Shaders