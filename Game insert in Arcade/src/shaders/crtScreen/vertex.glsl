varying vec2 vUv;

void main() {
    // Calcule la distance du centre pour la courbure
    float dist = distance(uv, vec2(0.5, 0.5));

    // Applique une courbure quadratique pour éviter les pics
    float bulge = 0.13 * (1.0 - dist * dist); // Utilisation de dist^2 pour adoucir la courbure
    vec3 newPosition = position + normal * bulge; // Applique la normale pour un effet plus lisse

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    // Varying
    vUv = uv;
}