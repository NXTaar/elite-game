import Stage from '@modules/stage'
import { PlayerShip, LaserBullet, Enemy } from '../objects'

class MainStage extends Stage {
    constructor(props) {
        super(props)
        this.visibleShots = []
        this.shotsRecycle = []
    }

    onAssetsReady(app, { Background }) {
        this.scene.interactive = true

        let backgroundTexture = new PIXI.Sprite(Background)

        this.playerShip = new PlayerShip({
            position: [400, 520]
        })

        this.enemyShip = new Enemy({
            position: [400, 50],
            borders: backgroundTexture
        })

        this.playerShip.drawAnchorPoint()
        this.playerShip.startMovement('followMouseX', backgroundTexture)

        this.scene.on('pointerdown', this.handlePlayerShooting)

        this.scene.addChild(backgroundTexture)
        this.scene.addChild(this.playerShip.unit)
        this.scene.addChild(this.enemyShip.unit)

        app.stage.addChild(this.scene)

        app.start()
    }

    checkEnemyHit = ({ random, collisionBodies, unit: { x: bulletX, y: bulletY } }) => {
        let bullet = collisionBodies[0]
        let enemy = this.enemyShip.collisionBodies[0]
        let { x: enemyX, y: enemyY } = this.enemyShip.unit

        bullet.updatePosition(bulletX, bulletY)
        enemy.updatePosition(enemyX, enemyY)

        let isHit = bullet.collision(enemy)

        isHit && console.log('Hit!!', random)
    }

    isPlayerOnFireLine = () => {

    }

    handlePlayerShooting = () => this.playerShip.firePoints.forEach(this.fireLaser)

    fireLaser = ({ x: firePointX, y: firePointY }) => {
        let { x, y } = this.playerShip.unit

        let shot = this.shotsRecycle.length > 0 ? this.shotsRecycle.shift() : new LaserBullet({ checkHit: this.checkEnemyHit })

        shot.position(x + firePointX, y + firePointY)

        !shot.isOnStage() && this.scene.addChild(shot.unit)

        shot.fire()

        this.visibleShots.push(shot)
    }

    tick() {
        let { visibleShots, shotsRecycle } = this.visibleShots.reduce((res, shot) => {
            if (shot.inSight) res.visibleShots.push(shot)
            else {
                res.shotsRecycle.push(shot)
                shot.stop()
            }

            return res
        }, { visibleShots: [], shotsRecycle: [] })

        Object.assign(this, {
            visibleShots,
            shotsRecycle: [
                ...this.shotsRecycle,
                ...shotsRecycle
            ]
        })
    }
}

export default MainStage
