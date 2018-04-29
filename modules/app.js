import { getCanvasSize } from './resize'

const app = new PIXI.Application({
    ...getCanvasSize(),
    antialias: true,
    view: document.querySelector('.app')
})

app.stop()

export default app

