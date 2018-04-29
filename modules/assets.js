import { imageFiles, imagesByFilename } from '@modules/images'
import assetsSettingsJSON from '../assets/json/assets.json'


const mapAssets = resolve => (loader, resources) => {
    let prerenderedAssets = {}
    let loadedAssets = Object.keys(resources).reduce((res, resourceName) => {
        let assetName = imagesByFilename[resourceName]
        let isAnimated = assetsSettingsJSON[assetName] && assetsSettingsJSON[assetName].frames

        if (!assetName) return res

        let texture = PIXI.loader.resources[resourceName].texture

        return {
            ...res,
            ...!isAnimated && { [assetName]: texture },
            ...isAnimated && { [assetName]: assetsSettingsJSON[assetName].frames
                .map(({ x, y, width, height }) => new PIXI.Texture(texture, new PIXI.Rectangle(x, y, width, height))) }
        }
    }, prerenderedAssets)

    exports.assetsSync = loadedAssets
    resolve(loadedAssets)
}

const loadAssets = () => new Promise(res => {
    PIXI.loader.add(imageFiles).load(mapAssets(res))
})

export const awaitAssets = loadAssets()

export const assetsConfig = assetsSettingsJSON
