uniform sampler2D videoTexture;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    // Base
    vec4 color = texture2D(videoTexture, uv);

    // Scanlines
    float scanline = sin(uv.y * 800.0) * 0.05;
    float brightness = 1.0 - scanline;
    color.rgb *= brightness;

    // Chromatic aberation
    float offset = 0.002;
    color.r = texture2D(videoTexture, uv + vec2(-offset, 0.0)).r;
    color.b = texture2D(videoTexture, uv + vec2(offset, 0.0)).b;

    gl_FragColor = color;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}