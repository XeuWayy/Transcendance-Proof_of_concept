import * as THREE from 'three/webgpu'
import {SkyMesh} from "three/addons/objects/SkyMesh.js";

import Game from "../Game.js"

class Environment {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene

        this.setDebug()
        this.initCubeCamera()
        this.setSky()
        this.setLight()
    }

    setDebug() {
        this.debugObject = this.game.debugObject

        this.environmentDebug = this.game.gui.addFolder({title: "🌞 - Environment/Light Debug", expanded: false})

        this.debugObject.turbidity = 5
        this.debugObject.rayleigh = 0.25
        this.debugObject.mieCoefficient = 0.005
        this.debugObject.mieDirectionalG = 1
        this.debugObject.elevation = 30
        this.debugObject.azimuth = 120

        this.environmentDebug.addBinding(this.debugObject, 'turbidity', {min: 0, max: 20, label: 'Sky turbidity'})
            .on('change', () => this.updateSky())
        this.environmentDebug.addBinding(this.debugObject, 'rayleigh', {min: 0, max: 20, label: 'Sky rayleigh'})
            .on('change', () => this.updateSky())
        this.environmentDebug.addBinding(this.debugObject, 'mieCoefficient', {min: 0, max: 1.5, label: 'Sky mieCoefficient'})
            .on('change', () => this.updateSky())
        this.environmentDebug.addBinding(this.debugObject, 'mieDirectionalG', {min: 0, max: 1, label: 'Sky mieDirectionalG'})
            .on('change', () => this.updateSky())
        this.environmentDebug.addBinding(this.debugObject, 'elevation', {min: -10, max: 90, label: 'Sky elevation'})
            .on('change', () => this.updateSky())
        this.environmentDebug.addBinding(this.debugObject, 'azimuth', {min: -180, max: 180, label: 'Sky azimuth'})
            .on('change', () => this.updateSky())

        this.environmentDebug.addBlade({view: 'separator'})

        this.debugObject.ambientLightColor = '#FFF'
        this.debugObject.ambientLightIntensity = 2
        this.debugObject.ambientLightPosition = new THREE.Vector3(5, 5, 0)

        this.environmentDebug.addBinding(this.debugObject, 'ambientLightColor', {label: 'Ambient light color'})
            .on('change', () => {this.defaultLight.color.set(this.debugObject.ambientLightColor)})
        this.environmentDebug.addBinding(this.debugObject, 'ambientLightIntensity', {min: 0, max: 20, label: 'Ambient light color'})
            .on('change', () => {this.defaultLight.intensity = this.debugObject.ambientLightIntensity})
        this.environmentDebug.addBinding(this.debugObject, 'ambientLightPosition', {label: 'Ambient light position'})
            .on('change', () => {this.defaultLight.position.copy(this.debugObject.ambientLightPosition)})
        this.environmentDebug.addBlade({view: 'separator'})

        this.debugObject.tvLightColor = '#FFF'
        this.debugObject.tvLightIntensity = 3
        this.debugObject.tvLightPosition= new THREE.Vector3(15, 3, -22)

        this.environmentDebug.addBinding(this.debugObject, 'tvLightColor', {label: 'TV light color'})
            .on('change', () => {this.tvLight.color.set(this.debugObject.tvLightColor)})
        this.environmentDebug.addBinding(this.debugObject, 'tvLightIntensity', {min: 0, max: 20, label: 'TV light color'})
            .on('change', () => {this.tvLight.intensity = this.debugObject.tvLightIntensity})
        this.environmentDebug.addBinding(this.debugObject, 'tvLightPosition', {label: 'Tv light position'})
            .on('change', () => {this.tvLight.position.copy(this.debugObject.tvLightPosition)})
    }

    initCubeCamera() {
        this.renderTarget = new THREE.WebGLCubeRenderTarget(128, {
            type: THREE.HalfFloatType,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter
        })
        this.cubeCamera = new THREE.CubeCamera(1, 1.1, this.renderTarget)
    }

    setSky() {
        this.sky = new SkyMesh()
        this.sky.scale.setScalar(450000);

        this.updateSky()

        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1,32,32),
            new THREE.MeshStandardNodeMaterial({
                metalness: 1,
                roughness: 0
            })
        )
        sphere.position.set(5,1, 0)
        this.scene.add(sphere)
        this.scene.add(this.sky)
    }

    updateSky() {
        const phi = THREE.MathUtils.degToRad(90 - this.debugObject.elevation)
        const theta = THREE.MathUtils.degToRad(this.debugObject.azimuth)
        const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta)

        const thetaReversed = THREE.MathUtils.degToRad(-this.debugObject.azimuth);
        const reversedSunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, thetaReversed)

        this.sky.turbidity.value = this.debugObject.turbidity
        this.sky.rayleigh.value = this.debugObject.rayleigh
        this.sky.mieCoefficient.value = this.debugObject.mieCoefficient
        this.sky.mieDirectionalG.value = this.debugObject.mieDirectionalG

        this.sky.sunPosition.value.copy(reversedSunPosition);
        this.cubeCamera.update(this.game.renderer.instance, this.sky)

        this.sky.sunPosition.value.copy(sunPosition);

        this.scene.environment = this.renderTarget.texture
    }

    setLight() {
        this.defaultLight = new THREE.AmbientLight(this.debugObject.ambientLightColor, this.debugObject.ambientLightIntensity)
        this.defaultLight.position.copy(this.debugObject.ambientLightPosition)
        this.scene.add(this.defaultLight)

        this.tvLight = new THREE.PointLight(this.debugObject.tvLightColor, this.debugObject.tvLightIntensity)
        this.tvLight.position.copy(this.debugObject.tvLightPosition)
        this.scene.add(this.tvLight)
    }
}
export default Environment