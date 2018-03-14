import * as PIXI from 'pixi.js'
import app from './app'

const renderAnchorPointTexture = () => {
    let raw = new PIXI.Graphics()

    raw.beginFill(0xFF00FF);
    raw.drawCircle(0, 0, 2)
    raw.endFill()

    return app.renderer.generateTexture(raw);
}


export const anchorPointTexture = renderAnchorPointTexture()

