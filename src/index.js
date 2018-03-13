import 'normalize.css'
import './styles.css'

import { Background as backgroundImage } from '@modules/images'
import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ width: 800, height: 600 })

const appContainer = document.querySelector('.app')
appContainer.requestPointerLock()
appContainer.appendChild(app.view)

let background = new PIXI.Container()
let backgroundTexture = PIXI.Sprite.fromImage(backgroundImage)
background.addChild(backgroundTexture)


app.stage.addChild(background)