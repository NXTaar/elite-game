import Stage from '@modules/stage'
import { Fader, Firepoint, GameObject, Hitbox, Movement, Projectile, StateMachine, Ticker } from '@components'
import { linearMoveAsync } from '@modules/movements'
import { assetsConfig } from '@modules/assets'

class MainStage extends Stage {
    constructor(props) {
        super(props)
        this.visibleShots = {}
        this.shotsRecycle = []
    }

    onAssetsReady(app, { Background, ShipCobra, ShipSidewinder, Explosion }) {
        this.addObject({
            id: 'background',
            sprite: {
                texture: Background
            }
        })

        this.playerShip = this.addObject({
            id: 'player',
            ship: 'cobra_mk3',
            interaction: ['pointerdown', this.handlePlayerShooting],
            config: assetsConfig.ShipCobra,
            sprite: {
                texture: ShipCobra,
                position: [400, 520]
            },
            movement: {
                type: 'followMouseX',
                gapFromBorder: assetsConfig.ShipCobra.gap,
                speed: 8,
                width: this.scene.width
            },
            common: [
                'Firepoint',
                'Fader',
                'Hitbox',
                'Ticker'
            ]
        })

        this.enemyShip = this.addObject({
            id: 'enemy',
            ship: 'sidewinder',
            borderSetups: {
                left: {
                    x: 0 + assetsConfig.ShipSidewinder.gap + ShipSidewinder.width / 2,
                    nextState: 'movingToRightBorder'
                },
                right: {
                    x: this.scene.width - assetsConfig.ShipSidewinder.gap - ShipSidewinder.width / 2,
                    nextState: 'movingToLeftBorder'
                }
            },
            config: assetsConfig.ShipSidewinder,
            sprite: {
                texture: ShipSidewinder,
                position: [400, ShipSidewinder.height * -1],
                rotation: Math.PI
            },
            states: [
                {
                    name: 'appearingOnTop',
                    initial: true,
                    action: this.enemyAppearOnTop
                },
                {
                    name: 'movingToLeftBorder',
                    action: this.enemyMoveToBorder('left')
                },
                {
                    name: 'movingToRightBorder',
                    action: this.enemyMoveToBorder('right')
                },
                {
                    name: 'attackingPlayer',
                    action: this.attackPlayer,
                    enterCondition: this.isPlayerOnFireLine,
                    cantEnterAfter: ['appearingOnTop']
                }
            ],
            common: [
                'Firepoint',
                'Hitbox',
                'Ticker'
            ]
        })

        this.explosion = this.addObject({
            id: 'explosion',
            config: assetsConfig.Explosion,
            sprite: {
                texture: Explosion,
                animation: {
                    animationSpeed: 0.2,
                    onComplete: this.fadeExplosion,
                    loop: false
                },
                position: [400, 250]
            },
            common: [
                'Fader',
                'Ticker'
            ]
        })

        this.explosion.play()

        app.stage.addChild(this.scene)

        app.start()
    }

    fadeExplosion = async () => {
        await this.explosion.fade({ to: 0, duration: 4000 })
    }

    enemyAppearOnTop = async ({ out, enter }) => {
        await linearMoveAsync(this.enemyShip.$, { destination: [400, 50], speed: 2 })

        out()
        enter(Math.random() >= 0.5 ? 'movingToLeftBorder' : 'movingToRightBorder')
    }

    enemyMoveToBorder = direction => async ({ out, enter }) => {
        let { x, nextState } = this.enemyShip.borderSetups[direction]
        let { y } = this.enemyShip.$

        await linearMoveAsync(this.enemyShip.$, { destination: [x, y], speed: 4 })

        out()
        enter(nextState)
    }

    recycleShot = bulletId => {
        let shotToRecycle = this.visibleShots[bulletId]

        delete this.visibleShots[bulletId]

        this.shotsRecycle.push(shotToRecycle)
    }

    getLaserObject = () => this.shotsRecycle.length > 0 ?
        this.shotsRecycle.shift() :
        this.addObject({
            id: Math.random(),
            config: assetsConfig.LaserBullet,
            sprite: {
                texture: this.assets.LaserBullet
            },
            projectile: {
                height: this.scene.height,
                onOutOfSight: this.handleLaserShotOutOfSight,
                onHit: this.handleLaserHit,
                speed: 10
            },
            common: [
                'Hitbox',
                'Ticker'
            ]
        })

    handleLaserShotOutOfSight = shot => this.recycleShot(shot.id)

    handleLaserHit = (hit, { $, id }) => {
        $.visible = false
        this.recycleShot(id)
        console.log(hit)
    }

    fireLaser = (shooter, target) => shooter.firepoints.forEach(firepoint => {
        let shot = this.getLaserObject()

        shot.$.visible = true
        shot.target = target
        shot.direction = shooter.id === 'player' ? -1 : 1
        shot.position(shooter.$.x + firepoint.x, shooter.$.y + firepoint.y)

        this.visibleShots[shot.id] = shot
    })

    handlePlayerShooting = () => this.fireLaser(this.playerShip, this.enemyShip)

    handleEnemyShooting = () => this.fireLaser(this.enemyShip, this.playerShip)

    isPlayerOnFireLine = () => {
        let { $: { x: playerX, width } } = this.playerShip
        let { x: enemyX } = this.enemyShip.$
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

    tick(delta) {
        // console.log(deltaToMs(delta))
        this.enemyShip.tick()
        this.playerShip.tick(delta)
        this.explosion.tick(delta)
        Object.keys(this.visibleShots).forEach(shotId => this.visibleShots[shotId].tick())
    }
}

export default MainStage
