/**
*@author https://codepen.io/driezis/pen/jOPzjLG
*/

uniform float rotation;
uniform vec2 center;

#include <common>

varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    vec2 scale;
    scale.x = length(vec3(modelMatrix[0].x, modelMatrix[0].y, modelMatrix[0].z));
    scale.y = length(vec3(modelMatrix[1].x, modelMatrix[1].y, modelMatrix[1].z));
    #ifndef USE_SIZEATTENUATION
    bool isPerspective = isPerspectiveMatrix(projectionMatrix);
    if (isPerspective) {
        scale *= - mvPosition.z;
    }
    #endif
    vec2 alignedPosition = (position.xy - (center - vec2(0.5))) * scale;
    vec2 rotatedPosition;
    rotatedPosition.x = cos(rotation) * alignedPosition.x - sin(rotation) * alignedPosition.y;
    rotatedPosition.y = sin(rotation) * alignedPosition.x + cos(rotation) * alignedPosition.y;
    mvPosition.xy += rotatedPosition;
    gl_Position = projectionMatrix * mvPosition;
}