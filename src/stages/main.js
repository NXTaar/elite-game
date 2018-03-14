import Stage from '@modules/stage'
import { getAnchorCoordinates } from '@modules/anchor'

class MainStage extends Stage {
    onAssetsReady(app, { Background, ShipCobra, anchorPoint }) {

        let background = new PIXI.Container()
        let backgroundTexture = new PIXI.Sprite(Background)
        let playerShip = new PIXI.Sprite(ShipCobra)
        let anchorPt = new PIXI.Sprite(anchorPoint)

        playerShip.anchor.set(0.5, 0.5)


        playerShip.x = 60
        playerShip.y = 210

        anchorPt.x = playerShip.x
        anchorPt.y = playerShip.y

        // 


        // getAnchorCoordinates(playerShip)



        background.addChild(backgroundTexture)
        background.addChild(playerShip)
        background.addChild(anchorPt)

        app.stage.addChild(background)

        app.start()
    }
}

export default MainStage