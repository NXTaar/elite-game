import { getCanvasSize } from './resize'

const appContainer = document.querySelector('.app')

const app = new PIXI.Application(getCanvasSize())

appContainer.appendChild(app.view)

app.stop()

export default app

