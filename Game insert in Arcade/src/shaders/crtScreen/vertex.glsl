varying vec2 vUv;

void main() {
     float dist = distance(uv, vec2(0.5, 0.5));

    float bulge = 0.13 * (1.0 - dist * dist);
    vec3 newPosition = position + normal * bulge;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varying
    vUv = uv;
}