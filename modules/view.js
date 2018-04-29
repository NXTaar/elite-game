import app from '@modules/app'
import state from '@modules/state'
import { awaitAssets, assetsConfig } from '@modules/assets'
import buildComponentSet from '@modules/set'
import pp from '@modules/private-props'

let { private_init, private_ticker, private_compileStageTree } = pp(['init', 'ticker', 'compileStageTree'])

const normalizeSprite = obj => obj instanceof PIXI.DisplayObject ? obj : obj.$

class View extends PIXI.Container {
    constructor() {
        super()
        this[private_init]()
    }

    async [private_init]() {
        let assets = await awaitAssets
        let stageTree

        Object.assign(this, { assets, state, config: assetsConfig })

        typeof this.prepare === 'function' && (stageTree = this.prepare() || {})

        Object.keys(stageTree).length > 0 && this[private_compileStageTree](stageTree)

        if (typeof this.tick !== 'function') return

        this[private_ticker] = this.tick.bind(this)

        app.ticker.add(this[private_ticker])
    }

    [private_compileStageTree](setup, root = true) {
        if (Array.isArray(setup)) return setup.forEach(item => this[private_compileStageTree](item, root))

        let { node, children, attach, ...props } = setup
        let nodeIsPixiObject = node instanceof PIXI.DisplayObject
        let compiled = nodeIsPixiObject ?
            node :
            this.compileObject({
                ...node,
                addToStage: false
            })

        Object.assign(compiled, props)

        children && children.length > 0 && children.forEach(child => {
            let compiledChild = this[private_compileStageTree](child, false)

            let container = nodeIsPixiObject ? compiled : compiled.$
            let target = normalizeSprite(compiledChild)

            container.addChild(target)
        })

        attach && typeof attach === 'string' && (this[attach] = compiled)

        attach && typeof attach === 'function' && attach(compiled)

        root && this.addChild(nodeIsPixiObject ? compiled : compiled.$)

        return compiled
    }

    compileObject(setup) {
        let compiled = buildComponentSet(setup)

        let { interaction, addToStage } = compiled

        addToStage && this.addChild(normalizeSprite(compiled))

        delete compiled.addToStage

        if (interaction) {
            this.interactive = true
            this.on(...interaction)
        }

        delete compiled.interaction

        return compiled
    }

    dismiss() {
        typeof this.onBeforeDismiss === 'function' && this.onBeforeDismiss()
        app.ticker.remove(this[private_ticker])
        this.destroy()
    }
}

export default View
