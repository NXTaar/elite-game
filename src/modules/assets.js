import * as PIXI from 'pixi.js'
import { imageFiles, imagesByFilename } from '@modules/images'
import { anchorPointTexture } from '@modules/anchor'

const mapAssets = resolve => (loader, resources) => {
    let prerenderedAssets = {
        anchorPoint: anchorPointTexture
    }
    let assets = Object.keys(resources).reduce((res, resourceName) => ({
        ...res,
        ...imagesByFilename[resourceName] && {
            [imagesByFilename[resourceName]]: PIXI.loader.resources[resourceName].texture
        }
    }), prerenderedAssets)

    resolve(assets)
}

const loadAssets = () => new Promise(res => {
    PIXI.loader.add(imageFiles).load(mapAssets(res))
})

export default loadAssets()