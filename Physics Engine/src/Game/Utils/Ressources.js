import * as THREE from 'three/webgpu'
import {GLTFLoader} from "three/addons";
import {MeshoptDecoder} from "three/addons/libs/meshopt_decoder.module.js";
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';

import EventEmitter from "./EventEmitter.js";
import sources from "../sources.js";
import Game from "../Game.js";

class Ressources extends EventEmitter {
    constructor(sources) {
        super()

        this.game = new Game()
        this.renderer = this.game.renderer

        this.sources = sources
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders().then( ()=> this.startLoading())
    }

    async setLoaders() {
        this.loaders = {}
        this.loaders.textureLoader = new THREE.TextureLoader()

        this.loaders.ktx2Loader = new KTX2Loader()
        this.loaders.ktx2Loader.setTranscoderPath('/libs/basis/')
        await this.loaders.ktx2Loader.detectSupportAsync(this.renderer.instance)

        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setMeshoptDecoder(MeshoptDecoder)
        this.loaders.gltfLoader.setKTX2Loader(this.loaders.ktx2Loader)
    }

    startLoading() {
        for(const source of sources) {
            switch (source.type) {
                case "texture":
                    this.loaders.textureLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file)
                    })
                    break
                case "ktx2Texture":
                    this.loaders.ktx2Loader.load(source.path, (file) => {
                        this.sourceLoaded(source, file)
                    })
                    break
                case "gltfModel":
                    this.loaders.gltfLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file)
                    })
                    break
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file

        this.loaded++
        if (this.loaded === this.toLoad) {
            this.trigger('loaded')
        }
    }

    cleanup() {
        if (this.loaders.ktx2Loader) {
            this.loaders.ktx2Loader.dispose()
        }

        for (const properties in this) {
            this[properties] = null
        }
    }
}

export default Ressources