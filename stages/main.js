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
            borders: backgroundTexture,
            attackCondition: this.needShootToPlayer,
            attackFn: this.attackPlayer
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

    checkEnemyHit = bullet => {
        let { random, collisionBodies, unit: { x: bulletX, y: bulletY } } = bullet
        let bulletHitbox = collisionBodies[0]
        let enemyHitboxes = this.enemyShip.collisionBodies

        let { x: enemyX, y: enemyY } = this.enemyShip.unit

        bulletHitbox.updatePosition(bulletX, bulletY)

        let hits = enemyHitboxes.reduce((res, hitbox) => {
            let { zone, side } = hitbox

            hitbox.updatePosition(enemyX, enemyY)

            let isHit = bulletHitbox.collision(hitbox)

            isHit && res.push({
                zone,
                ...side && { side },
                bulletId: random
            })

            return res
        }, [])

        if (hits.length === 0) return

        console.log(hits[0])

        bullet.hit()
    }

    needShootToPlayer = () => {
        let { unit: { x: playerX, width } } = this.playerShip
        let { x: enemyX } = this.enemyShip.unit
        let anchorOffset = width * 0.5
        let leftBound = playerX - anchorOffset
        let rightBound = playerX + anchorOffset

        let canShoot = !this.enemyCooldown && leftBound <= enemyX && enemyX <= rightBound

        if (canShoot) {
            this.enemyCooldown = true
            setTimeout(() => {
                this.enemyCooldown = false
            }, 700)
        }

        return canShoot
    }

    attackPlayer = ({ out }) => {
        this.handleEnemyShooting()
        out()
    }

    handlePlayerShooting = () => this.playerShip.firePoints.forEach(firepoint => this.fireLaser({
        firepoint,
        shooter: this.playerShip.unit,
        checkHit: this.checkEnemyHit
    }))

    handleEnemyShooting = () => this.enemyShip.firePoints.forEach(firepoint => this.fireLaser({
        firepoint,
        shooter: this.enemyShip.unit,
        direction: 1
    }))

    fireLaser = ({
        firepoint: { x: firePointX, y: firePointY },
        shooter: { x: shooterX, y: shooterY },
        direction = -1,
        checkHit = () => false
    }) => {
        let shot = this.shotsRecycle.length > 0 ? this.shotsRecycle.shift() : new LaserBullet()

        shot.changeDirection(direction)
        shot.checkHit = checkHit
        shot.position(shooterX + firePointX, shooterY + firePointY)

        !shot.isOnStage() && this.scene.addChild(shot.unit)

        shot.fire()

        this.visibleShots.push(shot)
    }

    tick() {
        let { visibleShots, shotsRecycle } = this.visibleShots.reduce((res, shot) => {
            if (shot.inSight && !shot.isHit) res.visibleShots.push(shot)
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
