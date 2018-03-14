import assetsLoaded from '@modules/assets'
import app from '@modules/app'

class Stage {
    constructor() {
        assetsLoaded.then(assets => typeof this.onAssetsReady === 'function' && this.onAssetsReady(app, assets))
    }

    // добавить логику создания и работы new PIXI.Container() для удобства работы со сценой
}

export default Stage