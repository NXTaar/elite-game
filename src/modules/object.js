import * as PIXI from 'pixi.js'
import app from './app'
import pp from './private-props'
import { assetsSync } from './assets'
import { isEqual } from './utils'

let privateProperty = pp([
    'anchorPoint',
    'anchorPointTexture',
])

class GameObject {
    constructor({
        texture,
        textureName,
        anchor,
        position,
        position: [pX = 0, pY = 0] = [],
        anchor: [aX = 0, aY = 0] = []
    }) {
        let textures = assetsSync
        let isValidTexture = texture && texture.constructor.name === 'Texture'
        let isValidTextureName = textureName && textures[textureName]
        let self = this

        isValidTexture && (this.unit = new PIXI.Sprite(texture))

        isValidTextureName && (this.unit = new PIXI.Sprite(textures[textureName]))

        if (!isValidTexture && !isValidTextureName) {
            this.unit = new PIXI.Container()
            console.warn('No texture was provided, check the name, provided texture or assets loaded status!')
        }

        anchor && (this.unit.anchor.set(aX, aY))
        position && (this.unit.position.set(pX, pY))

        this[privateProperty.anchorPoint] = null
        this[privateProperty.anchorPointTexture] = textures.anchorPoint

        typeof this.objectReady === 'function' && this.objectReady(app)
    }

    async drawAnchorPoint() {
        if (this[privateProperty.anchorPoint]) return

        this[privateProperty.anchorPoint] = new PIXI.Sprite(this[privateProperty.anchorPointTexture])

        this[privateProperty.anchorPoint].anchor.set(0.5, 0.5)

        this.unit.addChild(this[privateProperty.anchorPoint])
    }

    wipeAnchorPoint() {
        this.unit.removeChild(this[privateProperty.anchorPoint])

        this[privateProperty.anchorPoint] = null
    }
}

export default GameObject
