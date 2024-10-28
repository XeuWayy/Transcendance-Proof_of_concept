import * as THREE from 'three'
import GUI from 'lil-gui'
import Stats from "three/addons/libs/stats.module.js";

import FirstPersonCamera from "./FirstPersonCamera.js";
import CrosshairVertex from "./shaders/crosshair/vertex.glsl"
import CrosshairFragment from "./shaders/crosshair/fragment.glsl"


/**
 * Base
 */

// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// FPS Count
const stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.dom)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures loader
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.devicePixelRatio, 2)

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * First person camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(0, 1.9, 0)
scene.add(camera)
const fpsCamera = new FirstPersonCamera(camera)

/**
 * Crosshair
 */

/**
 *@author https://codepen.io/driezis/pen/jOPzjLG
 */
const crosshair = new THREE.ShaderMaterial({
  uniforms: {
    mainColor: {value: {r: 0, g: 1, b: 0.75}},
    border_Color: {value: {r: 0, g: 0, b: 0}},

    thickness: {value: 0.005},
    height: {value: 0.007},
    offset: {value: 0},
    border: {value: 0.002},

    opacity: {value: 1},
    center: {value: {x: 0.5, y: 0.5}},
    rotation: {value: 0}
  },
  vertexShader: CrosshairVertex,
  fragmentShader: CrosshairFragment,
  transparent: true,
});

const crosshairSprite = new THREE.Sprite(crosshair);
crosshairSprite.position.set(0,0,-0.5);
camera.add(crosshairSprite);

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

debugObject.clearColor = '#160920'
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
renderer.setClearColor(debugObject.clearColor)

/**
 * Scene Object
 */

// Light

const light = new THREE.AmbientLight('#FFFFFF', 2)
light.position.set(5,5,0)
scene.add(light)

// Ground

const groundArmTexture = textureLoader.load('/floor/granite_tile_arm_1k.png')
groundArmTexture.colorSpace = THREE.SRGBColorSpace
groundArmTexture.repeat.set(16, 16)
groundArmTexture.wrapS = THREE.RepeatWrapping
groundArmTexture.wrapT = THREE.RepeatWrapping

const groundDiffTexture = textureLoader.load('/floor/granite_tile_diff_1k.jpg')
groundDiffTexture.repeat.set(16, 16)
groundDiffTexture.wrapS = THREE.RepeatWrapping
groundDiffTexture.wrapT = THREE.RepeatWrapping

const groundNorTexture = textureLoader.load('/floor/granite_tile_nor_gl_1k.png')
groundNorTexture.repeat.set(16, 16)
groundNorTexture.wrapS = THREE.RepeatWrapping
groundNorTexture.wrapT = THREE.RepeatWrapping

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 100, 100),
  new THREE.MeshStandardMaterial({
      map: groundDiffTexture,
      normalMap: groundNorTexture,
      aoMap: groundArmTexture,
      roughnessMap: groundArmTexture,
      metalnessMap: groundArmTexture,
      side: THREE.DoubleSide
  })
)
ground.rotation.x = -Math.PI * 0.5;
ground.position.y = 0
scene.add(ground)

// Cube

const cubeArmTexture = textureLoader.load('/cube/broken_wall_arm_1k.png')
cubeArmTexture.repeat.set(2, 2)
cubeArmTexture.wrapS = THREE.RepeatWrapping
cubeArmTexture.wrapT = THREE.RepeatWrapping


const cubeDiffTexture = textureLoader.load('/cube/broken_wall_diff_1k.jpg')
cubeDiffTexture.colorSpace = THREE.SRGBColorSpace
cubeDiffTexture.repeat.set(2, 2)
cubeDiffTexture.wrapS = THREE.RepeatWrapping
cubeDiffTexture.wrapT = THREE.RepeatWrapping

const cubeNorTexture = textureLoader.load('/cube/broken_wall_nor_gl_1k.png')
cubeNorTexture.repeat.set(2, 2)
cubeNorTexture.wrapS = THREE.RepeatWrapping
cubeNorTexture.wrapT = THREE.RepeatWrapping

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5, 128, 128),
  new THREE.MeshStandardMaterial({
      map: cubeDiffTexture,
      normalMap: cubeNorTexture,
      aoMap: cubeArmTexture,
      roughnessMap: cubeArmTexture,
      metalnessMap: cubeArmTexture
  })
)
cube.position.set(15,2.5, -30)
scene.add(cube)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5, 128, 128),
  new THREE.MeshStandardMaterial({
      map: cubeDiffTexture,
      normalMap: cubeNorTexture,
      aoMap: cubeArmTexture,
      roughnessMap: cubeArmTexture,
      metalnessMap: cubeArmTexture
  })
)
cube2.position.set(-15,2.5, -30)
scene.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5, 128, 128),
    new THREE.MeshStandardMaterial({
        map: cubeDiffTexture,
        normalMap: cubeNorTexture,
        aoMap: cubeArmTexture,
        roughnessMap: cubeArmTexture,
        metalnessMap: cubeArmTexture
    })
)
cube3.position.set(15,2.5, 30)
scene.add(cube3)

const cube4 = new THREE.Mesh(
    new THREE.BoxGeometry(5, 5, 5, 128, 128),
    new THREE.MeshStandardMaterial({
        map: cubeDiffTexture,
        normalMap: cubeNorTexture,
        aoMap: cubeArmTexture,
        roughnessMap: cubeArmTexture,
        metalnessMap: cubeArmTexture
    })
)
cube4.position.set(-15,2.5, 30)
scene.add(cube4)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin()
    const elapsedTime = clock.getDelta()

    // Update first person
    fpsCamera.update(elapsedTime)

    // Render normal scene
    renderer.render(scene, camera)

    stats.end()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()