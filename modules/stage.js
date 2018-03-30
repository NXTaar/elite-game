import { awaitAssets } from '@modules/assets'
import app from '@modules/app'

class Stage {
    constructor() {
        awaitAssets.then(assets => typeof this.onAssetsReady === 'function' && this.onAssetsReady(app, assets))
        this.scene = new PIXI.Container()

        typeof this.tick === 'function' && app.ticker.add(this.tick.bind(this))
    }

    destroy() {
        app.ticker.remove(this.tick)
    }
    // добавить логику создания и работы new PIXI.Container() для удобства работы со сценой
}

export default Stage