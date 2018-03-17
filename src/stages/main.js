import Stage from '@modules/stage'
import GameObject from '@modules/object'
import { getAnchorCoordinates } from '@modules/anchor'
import { getMousePosition, getCoordinatesString } from '@modules/mouse'
import { isEqual } from '@modules/utils'

class MainStage extends Stage {
    onAssetsReady(app, { Background }) {
        this.scene.interactive = true

        let backgroundTexture = new PIXI.Sprite(Background)

        this.playerShip = new GameObject({
            textureName: 'ShipCobra',
            anchor: [0.5, 0.5],
            position: [400, 520]
        })

        this.playerShip.drawAnchorPoint()

        this.mp = null;

        this.scene.addChild(backgroundTexture)
        this.scene.addChild(this.playerShip.unit)

        app.stage.addChild(this.scene)

        app.start()
    }

    tick() {

        let mousePosition = getMousePosition()

        if (!isEqual(mousePosition, this.mp)) {
            console.log(this.mp, mousePosition)
            this.mp = mousePosition;
        }
    }
}

export default MainStage