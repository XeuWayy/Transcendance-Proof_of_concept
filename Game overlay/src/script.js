import * as THREE from 'three'
import GUI from 'lil-gui'
import Stats from "three/addons/libs/stats.module.js";
import {REVISION} from "three"
import {GLTFLoader} from "three/addons";
import {MeshoptDecoder} from "three/addons/libs/meshopt_decoder.module.js";
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';

import FirstPersonCamera from "./FirstPersonCamera.js";
import CrosshairVertex from "./shaders/crosshair/vertex.glsl"
import CrosshairFragment from "./shaders/crosshair/fragment.glsl"
import crtVertex from "./shaders/crtScreen/vertex.glsl"
import crtFragment from "./shaders/crtScreen/fragment.glsl"
import flatCrtVertex from "./shaders/flatCrt/vertex.glsl"
import flatCrtFragment from "./shaders/flatCrt/fragment.glsl"

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
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

debugObject.clearColor = '#160920'
gui.addColor(debugObject, 'clearColor').onChange(() => { renderer.setClearColor(debugObject.clearColor) })
renderer.setClearColor(debugObject.clearColor)

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`
const ktx2Loader = new KTX2Loader()
ktx2Loader.setTranscoderPath(`${THREE_PATH}/examples/jsm/libs/basis/`)
ktx2Loader.detectSupport(renderer)

const gltfLoader = new GLTFLoader()
gltfLoader.setMeshoptDecoder(MeshoptDecoder);
gltfLoader.setKTX2Loader(ktx2Loader)

/**
 * First person camera
 */

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(-15, 1.7, -25)
scene.add(camera)
const fpsCamera = new FirstPersonCamera(camera)

/**
 * Crosshair
 * @author https://codepen.io/driezis/pen/jOPzjLG
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
 * Scene Object
 */

// Light

const light = new THREE.AmbientLight('#FFFFFF', 2)
light.position.set(5,5,0)
scene.add(light)

const tvLight = new THREE.PointLight('white', 3)
tvLight.position.set(15, 3, -22)
scene.add(tvLight)

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

const position = [
    new THREE.Vector3(15,2.5, -30),
    new THREE.Vector3(-15,2.5, -30),
    new THREE.Vector3(15,2.5, 30),
    new THREE.Vector3(-15,2.5, 30)
]

for (let i = 0; i < position.length; i++) {
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(5, 5, 5, 32, 32),
        new THREE.MeshStandardMaterial({
            map: cubeDiffTexture,
            normalMap: cubeNorTexture,
            aoMap: cubeArmTexture,
            roughnessMap: cubeArmTexture,
            metalnessMap: cubeArmTexture
        })
    )
    cube.position.set(position[i].x, position[i].y, position[i].z)
    scene.add(cube)
}

/**
 * Pong TV Part
 */

const sofa = gltfLoader.load('./gltf/sofa_web/scene.glb', (load) => {
    load.scene.scale.set(0.003, 0.004, 0.004)
    load.scene.position.set(15, 0, -26)
    scene.add(load.scene)
})

const tvTable = gltfLoader.load('./gltf/tv_table/scene.glb', (load) => {
    load.scene.scale.set(1.25, 1, 1)
    load.scene.position.set(16, 0, -22.5)
    load.scene.rotation.y = Math.PI
    scene.add(load.scene)
})

/**
 * TV
 */

const videoElement = document.querySelector('video.webglVideo')
const pongTexture = new THREE.VideoTexture(videoElement)
pongTexture.minFilter = THREE.LinearFilter;
pongTexture.magFilter = THREE.LinearFilter;
pongTexture.format = THREE.RGBFormat;

const sadTv = gltfLoader.load('./gltf/old_tv/scene.glb', (load) => {
    load.scene.scale.set(0.009, 0.009, 0.009)
    load.scene.position.set(15.5, 1.02, -22)
    load.scene.rotation.y = Math.PI
    scene.add(load.scene)
})

// Test plane

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.74, 0.566),
    new THREE.MeshBasicMaterial({
        map: pongTexture,
        side: THREE.BackSide,
        transparent: true,
    })
)
plane.position.set(15.605, 1.04, -22.27)
scene.add(plane)

/**
 * THE COOLER TV
 */
const geometry = new THREE.PlaneGeometry(0.914, 0.686, 128, 128);

const material = new THREE.ShaderMaterial({
    uniforms: {
        videoTexture: { value: pongTexture }
    },
    vertexShader: crtVertex,
    fragmentShader: crtFragment,
    side: THREE.DoubleSide
});

const screen = new THREE.Mesh(geometry, material);
screen.position.set(14.40, 1.11, -22.3565);
screen.rotation.y = Math.PI
scene.add(screen);


let model
const coolerTv = gltfLoader.load('./gltf/old_tvclean/old_tvclean_compressed.glb', (tv) => {
    tv.scene.position.set(14.25, 0.60, -22)
    model = tv.scene
    scene.add(tv.scene)
    model.traverse((child) => {
        if (child.isMesh) {
            if (child.isMesh && child.name === 'defaultMaterial_2') {
                child.material.color = 'black'
            }
        }
    });
})


/**
 * Tetris game part
 */

const objectsToIntersect = []

// Collada object
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';
const colladaLoader = new ColladaLoader();
colladaLoader.load('./Tetris/model.dae', function (collada) {

    const tetrisMachine = collada.scene;
    tetrisMachine.rotation.z = -Math.PI * 0.5 // git #24289 issue
    tetrisMachine.position.set(-15.40, 0, -27)
    tetrisMachine.scale.set(0.030, 0.030, 0.030)
    scene.add( tetrisMachine );
    objectsToIntersect.push(tetrisMachine)
})

const tetrisCanvas = document.getElementById('tetrisCanvas')
const canvasTexture = new THREE.CanvasTexture(tetrisCanvas)
canvas.colorSpace = THREE.SRGBColorSpace

const tetrisGame = new THREE.Mesh(
    new THREE.PlaneGeometry(0.475, 0.352, 128, 128),
    new THREE.ShaderMaterial({
        uniforms: {
            videoTexture: { value: canvasTexture }
        },
        vertexShader: flatCrtVertex,
        fragmentShader: flatCrtFragment,
        side: THREE.DoubleSide
    })
)
tetrisGame.position.set(-15.034, 1.553, -26.474)
tetrisGame.rotation.x = -Math.PI * 0.15
objectsToIntersect.push(tetrisGame)
scene.add(tetrisGame)


window.addEventListener('keydown', (event) => {
    if (event.code === 'KeyE') {
        const cameraDirection = camera.getWorldDirection(new THREE.Vector3())

        const raycast = new THREE.Raycaster()
        raycast.camera = camera
        raycast.far = 1.5
        raycast.set(camera.position, cameraDirection)
        const intersects = raycast.intersectObjects(objectsToIntersect, true)
        if (intersects.length > 0) {
            centerCameraOnArcade()
        }
    }
})
const centerCameraOnArcade = () =>{
    if (!fpsCamera.isInteractingWithArcade) {
        fpsCamera.isInteractingWithArcade= true
        camera.position.set(-15.03, 1.7, -26.15)
        camera.rotation.set(-0.4940008349279439, -0.0017608863389264688, -0.0009483038705260853)
    }  else {
        fpsCamera.isInteractingWithArcade = false
        camera.position.set(-15, 1.7, -25.15)
    }
}

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

    // Update the TV
    pongTexture.update()

    // Update the tetris game
    canvasTexture.needsUpdate = true

    renderer.render(scene, camera)

    stats.end()
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()