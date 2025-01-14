import * as THREE from 'three/webgpu'
import {SkyMesh} from "three/addons/objects/SkyMesh.js"

import Game from "../Game.js"

class Environment {
    constructor() {
        this.game = new Game()
        this.scene = this.game.scene
        this.renderer = this.game.renderer

        this.setDebug()
        this.initCubeCamera()
        this.setSky()
        this.setLight()
    }

    setDebug() {
        this.debugObject = this.game.debugObject

        this.environmentDebug = this.game.gui.addFolder({title: "🌞 - Environment/Light Debug", expanded: false})
        this.skyDebug = this.environmentDebug.addFolder({title: "⛅ - Sky Debug", expanded: false})
        this.lightDebug = this.environmentDebug.addFolder({title: "💡 - Light Debug", expanded: false})

        this.debugObject.turbidity = 5
        this.debugObject.rayleigh = 0.25
        this.debugObject.mieCoefficient = 0.005
        this.debugObject.mieDirectionalG = 0.998
        this.debugObject.elevation = 10
        this.debugObject.azimuth = 90

        this.debugObject.skyStates = {
            sunrise: {
                turbidity: 5,
                rayleigh: 0.25,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.998,
                elevation: 10,
                azimuth: 90
            },
            noon: {
                turbidity: 10,
                rayleigh: 0.5,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.975,
                elevation: 90,
                azimuth: 180
            },
            afternoon: {
                turbidity: 8,
                rayleigh: 1,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.98,
                elevation: 45,
                azimuth: -100
            },
            sunset: {
                turbidity: 6,
                rayleigh: 2,
                mieCoefficient: 0.005,
                mieDirectionalG: 0.99,
                elevation: 10,
                azimuth: -90
            },
            night: {
                turbidity: 2,
                rayleigh: 4,
                mieCoefficient: 0.001,
                mieDirectionalG: 0.999,
                elevation: -5,
                azimuth: 180
            }
        }

        this.skyDebug.addBinding(this.debugObject, 'turbidity', {min: 0, max: 20, label: 'Sky turbidity'})
            .on('change', () => this.updateSky())
        this.skyDebug.addBinding(this.debugObject, 'rayleigh', {min: 0, max: 20, label: 'Sky rayleigh'})
            .on('change', () => this.updateSky())
        this.skyDebug.addBinding(this.debugObject, 'mieCoefficient', {min: 0, max: 1.5, label: 'Sky mieCoefficient'})
            .on('change', () => this.updateSky())
        this.skyDebug.addBinding(this.debugObject, 'mieDirectionalG', {min: 0, max: 1, label: 'Sky mieDirectionalG'})
            .on('change', () => this.updateSky())
        this.skyDebug.addBinding(this.debugObject, 'elevation', {min: -10, max: 90, label: 'Sky elevation'})
            .on('change', () => this.updateSky())
        this.skyDebug.addBinding(this.debugObject, 'azimuth', {min: -180, max: 180, label: 'Sky azimuth'})
            .on('change', () => this.updateSky())

        this.skyDebug.addBlade({view: 'separator'})

        this.skyDebug.addButton({title: 'Set Sunrise'})
            .on('click', () => this.setSkyStates(this.debugObject.skyStates.sunrise))
        this.skyDebug.addButton({title: 'Set Noon'})
            .on('click', () => this.setSkyStates(this.debugObject.skyStates.noon))
        this.skyDebug.addButton({title: 'Set Afternoon'})
            .on('click', () => this.setSkyStates(this.debugObject.skyStates.afternoon))
        this.skyDebug.addButton({title: 'Set Sunset'})
            .on('click', () => this.setSkyStates(this.debugObject.skyStates.sunset))
        this.skyDebug.addButton({title: 'Set Night'})
            .on('click', () => this.setSkyStates(this.debugObject.skyStates.night))

        this.debugObject.ambientLightColor = '#FFF'
        this.debugObject.ambientLightIntensity = 2
        this.debugObject.ambientLightPosition = new THREE.Vector3(5, 5, 0)

        this.lightDebug.addBinding(this.debugObject, 'ambientLightColor', {label: 'Ambient light color'})
            .on('change', () => {this.defaultLight.color.set(this.debugObject.ambientLightColor)})
        this.lightDebug.addBinding(this.debugObject, 'ambientLightIntensity', {min: 0, max: 20, label: 'Ambient light color'})
            .on('change', () => {this.defaultLight.intensity = this.debugObject.ambientLightIntensity})
        this.lightDebug.addBinding(this.debugObject, 'ambientLightPosition', {label: 'Ambient light position'})
            .on('change', () => {this.defaultLight.position.copy(this.debugObject.ambientLightPosition)})
        this.lightDebug.addBlade({view: 'separator'})

        this.debugObject.tvLightColor = '#FFF'
        this.debugObject.tvLightIntensity = 3
        this.debugObject.tvLightPosition= new THREE.Vector3(15, 3, -22)

        this.lightDebug.addBinding(this.debugObject, 'tvLightColor', {label: 'TV light color'})
            .on('change', () => {this.tvLight.color.set(this.debugObject.tvLightColor)})
        this.lightDebug.addBinding(this.debugObject, 'tvLightIntensity', {min: 0, max: 20, label: 'TV light color'})
            .on('change', () => {this.tvLight.intensity = this.debugObject.tvLightIntensity})
        this.lightDebug.addBinding(this.debugObject, 'tvLightPosition', {label: 'Tv light position'})
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

    setSkyStates(skyState) {
        this.debugObject.turbidity = skyState.turbidity
        this.debugObject.rayleigh = skyState.rayleigh
        this.debugObject.mieCoefficient = skyState.mieCoefficient
        this.debugObject.mieDirectionalG = skyState.mieDirectionalG
        this.debugObject.elevation = skyState.elevation
        this.debugObject.azimuth = skyState.azimuth

        this.skyDebug.refresh()
        this.updateSky()
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