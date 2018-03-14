import * as PIXI from 'pixi.js'

const appContainer = document.querySelector('.app')

const app = new PIXI.Application({ width: 800, height: 600 })

appContainer.appendChild(app.view)

app.stop()

export default app

