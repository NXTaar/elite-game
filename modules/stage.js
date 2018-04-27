import { awaitAssets } from '@modules/assets'
import app from '@modules/app'
import buildComponentSet from '@modules/set'

class Stage {
    constructor() {
        awaitAssets.then(assets => {
            typeof this.onAssetsReady === 'function' && this.onAssetsReady(app, assets)
            this.assets = assets
        })
        this.scene = new PIXI.Container()

        typeof this.tick === 'function' && app.ticker.add(this.tick.bind(this))
    }

    addObject(setup) {
        let object = {
            addToStage: true,
            ...buildComponentSet(setup)
        }

        object.addToStage && object.$ && this.scene.addChild(object.$)

        delete object.addToStage

        if (object.interaction) {
            this.scene.interactive = true
            this.scene.on(...object.interaction)
        }

        delete object.interaction

        return object
    }

    destroy() {
        app.ticker.remove(this.tick)
    }
    // добавить логику создания и работы new PIXI.Container() для удобства работы со сценой
}

export default Stage
