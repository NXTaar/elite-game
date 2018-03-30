import { imageFiles, imagesByFilename } from '@modules/images'
import { anchorPointTexture } from '@modules/anchor'
import assetsSettingsJSON from '../assets/json/assets.json'


const mapAssets = resolve => (loader, resources) => {
    let prerenderedAssets = {
        anchorPoint: anchorPointTexture
    }
    let loadedAssets = Object.keys(resources).reduce((res, resourceName) => ({
        ...res,
        ...imagesByFilename[resourceName] && {
            [imagesByFilename[resourceName]]: PIXI.loader.resources[resourceName].texture
        }
    }), prerenderedAssets)

    exports.assetsSync = loadedAssets
    resolve(loadedAssets)
}

const loadAssets = () => new Promise(res => {
    PIXI.loader.add(imageFiles).load(mapAssets(res))
})

export const awaitAssets = loadAssets()

export const assetsConfig = assetsSettingsJSON
