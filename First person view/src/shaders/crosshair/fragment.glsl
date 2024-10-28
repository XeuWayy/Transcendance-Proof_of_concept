/**
*@author https://codepen.io/driezis/pen/jOPzjLG
*/

uniform vec3 mainColor;
uniform vec3 borderColor;
uniform float opacity;

uniform float thickness;
uniform float height;
uniform float offset;
uniform float border;

varying vec2 vUv;
void main() {

    float a = (step(abs(vUv.x - 0.5), thickness)) * step(abs(vUv.y - 0.5), height + offset) * step(offset, abs(vUv.y - 0.5)) + (step(abs(vUv.y - 0.5), thickness)) * step(abs(vUv.x - 0.5), height + offset) * step(offset, abs(vUv.x - 0.5));
    float b = (step(abs(vUv.x - 0.5), thickness - border)) * step(abs(vUv.y - 0.5), height + offset - border) * step(offset + border, abs(vUv.y - 0.5)) + (step(abs(vUv.y - 0.5), thickness - border)) * step(abs(vUv.x - 0.5), height + offset - border) * step(offset + border, abs(vUv.x - 0.5));
    gl_FragColor = vec4( mix(borderColor, mainColor, b), a * opacity);
}