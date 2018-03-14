import * as PIXI from 'pixi.js'

class GameObject {
    constructor({
        texture,
        anchor: {
            aX = 0,
            aY = 0
        }
    }) {
        this.container = texture ? new PIXI.Sprite(texture) : new PIXI.Container()
        anchor && (this.container.anchor.set(aX, aY))
    }
}