import * as THREE from 'three'
import GUI from 'lil-gui'

import FirstPersonCamera from "./FirstPersonCamera.js";

/**
 * Base
 */

// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

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
groundArmTexture.wrapS = THREE.RepeatWrapping
groundArmTexture.wrapT = THREE.RepeatWrapping
groundArmTexture.repeat.set(16, 16)

const groundDiffTexture = textureLoader.load('/floor/granite_tile_diff_1k.jpg')
groundDiffTexture.wrapS = THREE.RepeatWrapping
groundDiffTexture.wrapT = THREE.RepeatWrapping
groundDiffTexture.repeat.set(16, 16)

const groundNorTexture = textureLoader.load('/floor/granite_tile_nor_gl_1k.jpg')
groundNorTexture.wrapS = THREE.RepeatWrapping
groundNorTexture.wrapT = THREE.RepeatWrapping
groundNorTexture.repeat.set(16, 16)

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100, 100, 100),
  new THREE.MeshStandardMaterial({
      map: groundDiffTexture,
      displacementMap: groundNorTexture,
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
cubeArmTexture.wrapS = THREE.RepeatWrapping
cubeArmTexture.wrapT = THREE.RepeatWrapping
cubeArmTexture.repeat.set(2, 2)

const cubeDiffTexture = textureLoader.load('/cube/broken_wall_diff_1k.jpg')
cubeDiffTexture.wrapS = THREE.RepeatWrapping
cubeDiffTexture.wrapT = THREE.RepeatWrapping
cubeDiffTexture.repeat.set(2, 2)

const cubeNorTexture = textureLoader.load('/cube/broken_wall_nor_gl_1k.jpg')
cubeNorTexture.wrapS = THREE.RepeatWrapping
cubeNorTexture.wrapT = THREE.RepeatWrapping
cubeNorTexture.repeat.set(2, 2)

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({
      map: cubeDiffTexture,
      displacementMap: cubeNorTexture,
      aoMap: cubeArmTexture,
      roughnessMap: cubeArmTexture,
      metalnessMap: cubeArmTexture
  })
)
cube.position.set(15,2.5, -30)
scene.add(cube)

const cube2ArmTexture = textureLoader.load('/cube/broken_wall_arm_1k.png')
cube2ArmTexture.wrapS = THREE.RepeatWrapping
cube2ArmTexture.wrapT = THREE.RepeatWrapping
cube2ArmTexture.repeat.set(2, 2)

const cube2DiffTexture = textureLoader.load('/cube/broken_wall_diff_1k.jpg')
cube2DiffTexture.wrapS = THREE.RepeatWrapping
cube2DiffTexture.wrapT = THREE.RepeatWrapping
cube2DiffTexture.repeat.set(2, 2)

const cube2NorTexture = textureLoader.load('/cube/broken_wall_nor_gl_1k.jpg')
cube2NorTexture.wrapS = THREE.RepeatWrapping
cube2NorTexture.wrapT = THREE.RepeatWrapping
cube2NorTexture.repeat.set(2, 2)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(5, 5, 5),
  new THREE.MeshStandardMaterial({
      map: cube2DiffTexture,
      displacementMap: cube2NorTexture,
      aoMap: cube2ArmTexture,
      roughnessMap: cube2ArmTexture,
      metalnessMap: cube2ArmTexture
  })
)
cube2.position.set(-15,2.5, -30)
scene.add(cube2)


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getDelta()

    // Update first person
    fpsCamera.update(elapsedTime)

    // Render normal scene
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()