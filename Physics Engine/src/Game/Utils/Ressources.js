import * as THREE from 'three'
import {REVISION} from "three"
import {GLTFLoader} from "three/addons";
import {MeshoptDecoder} from "three/addons/libs/meshopt_decoder.module.js";
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js'

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

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.textureLoader = new THREE.TextureLoader()

        const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`
        this.loaders.ktx2Loader = new KTX2Loader()
        this.loaders.ktx2Loader.setTranscoderPath(`${THREE_PATH}/examples/jsm/libs/basis/`)
        this.loaders.ktx2Loader.detectSupport(this.renderer.instance)

        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setMeshoptDecoder(MeshoptDecoder)
        this.loaders.gltfLoader.setKTX2Loader(this.loaders.ktx2Loader)

        this.loaders.colladaLoader = new ColladaLoader()
    }

    startLoading() {
        for(const source of sources) {
            switch (source.type) {
                case "texture":
                    this.loaders.textureLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file)
                    })
                    break
                case "gltfModel":
                    this.loaders.gltfLoader.load(source.path, (file) => {
                        this.sourceLoaded(source, file)
                    })
                    break
                case "colladaModel":
                    this.loaders.colladaLoader.load(source.path, (file) => {
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
}

export default Ressources