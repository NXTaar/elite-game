import app from './app'
import pp from './private-props'
import { assetsSync, assetsConfig } from './assets'
import * as movementFunctions from './movements'

let privateProperty = pp([
    'anchorPoint',
    'anchorPointTexture',
    'tick'
])

class GameObject {
    constructor({
        texture,
        textureName,
        anchor,
        position,
        movements = [],
        position: [pX = 0, pY = 0] = [],
        anchor: [aX = 0, aY = 0] = []
    }) {
        let textures = assetsSync

        let isValidTexture = texture && texture.constructor.name === 'Texture'

        let isValidTextureName = textureName && textures[textureName]


        this.movements = movements

        isValidTexture && (this.unit = new PIXI.Sprite(texture))

        isValidTextureName && (this.unit = new PIXI.Sprite(textures[textureName]))

        assetsConfig[textureName] && (this.config = assetsConfig[textureName])

        if (!isValidTexture && !isValidTextureName) {
            this.unit = new PIXI.Container()
            console.warn('No texture was provided, check the name, provided texture or assets loaded status!')
        }

        anchor && this.unit.anchor.set(aX, aY)
        position && this.position(pX, pY)

        this[privateProperty.anchorPoint] = null
        this[privateProperty.anchorPointTexture] = textures.anchorPoint

        this.anchorXY = [this.unit.width * this.unit.anchor.x, this.unit.height * this.unit.anchor.y]

        typeof this.objectReady === 'function' && this.objectReady(app)

        app.ticker.add(this[privateProperty.tick].bind(this))
    }

    position(x, y = this.unit.y) {
        x = x || this.unit.x
        this.unit.position.set(x, y)
        typeof this.onPositionChange === 'function' && this.onPositionChange(x, y)
    }

    isOnStage() {
        return !!this.unit.parent
    }

    startMovement(name, params = {}) {
        movementFunctions[name] && this.movements.push({
            name,
            move: movementFunctions[name],
            params
        })
    }

    stopMovement(name) {
        this.movements.reduce((res, movementSetup) => [
            ...res,
            ...movementSetup.name === name ? [] : [movementSetup]
        ], [])
    }

    drawAnchorPoint() {
        if (this[privateProperty.anchorPoint]) return

        this[privateProperty.anchorPoint] = new PIXI.Sprite(this[privateProperty.anchorPointTexture])

        this[privateProperty.anchorPoint].anchor.set(0.5, 0.5)

        this.unit.addChild(this[privateProperty.anchorPoint])
    }

    wipeAnchorPoint() {
        this.unit.removeChild(this[privateProperty.anchorPoint])

        this[privateProperty.anchorPoint] = null
    }

    [privateProperty.tick]() {
        this.movements.forEach(({ move, params }) => move(this.unit, params))

        typeof this.tick === 'function' && this.tick()
    }
}

export default GameObject
