import Stage from '@modules/stage'
import { Firepoint, GameObject, Hitbox, Movement, StateMachine, Ticker } from '@components'
import { linearMoveAsync } from '@modules/movements'
import { assetsConfig } from '@modules/assets'
import Projectile from '../components/projectile'

class MainStage extends Stage {
    constructor(props) {
        super(props)
        this.visibleShots = {}
        this.shotsRecycle = []
    }

    onAssetsReady(app, { Background, ShipCobra, ShipSidewinder, LaserBullet }) {
        this.addObject([
            { id: 'background' },
            {
                component: GameObject,
                texture: Background
            }
        ])

        this.laserShotTexture = LaserBullet

        this.playerShip = this.addObject([
            {
                id: 'player',
                ship: 'cobra_mk3',
                interaction: ['pointerdown', this.handlePlayerShooting],
                config: assetsConfig.ShipCobra
            },
            {
                component: GameObject,
                texture: ShipCobra,
                position: [400, 520]
            },
            {
                component: Movement,
                movement: 'followMouseX',
                gapFromBorder: assetsConfig.ShipCobra.gap,
                speed: 8,
                width: this.scene.width
            },
            {
                component: Firepoint
            },
            {
                component: Hitbox
            },
            {
                component: Ticker
            }
        ])

        this.enemyShip = this.addObject([
            {
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
                config: assetsConfig.ShipSidewinder
            },
            {
                component: GameObject,
                texture: ShipSidewinder,
                position: [400, ShipSidewinder.height * -1],
                rotation: Math.PI
            },
            {
                component: StateMachine,
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
                        enterCondition: this.needShootToPlayer,
                        cantEnterAfter: ['appearingOnTop']
                    }
                ]
            },
            {
                component: Firepoint
            },
            {
                component: Hitbox
            },
            {
                component: Ticker
            }
        ])

        app.stage.addChild(this.scene)

        app.start()
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
        this.addObject([
            {
                projectile: 'laser',
                id: Math.random(),
                config: assetsConfig.LaserBullet
            },
            {
                component: GameObject,
                texture: this.laserShotTexture
            },
            {
                component: Hitbox
            },
            {
                component: Projectile,
                height: this.scene.height,
                onOutOfSight: this.handleLaserShotOutOfSight,
                onHit: this.handleLaserHit,
                speed: 10
            },
            {
                component: Ticker
            }
        ])

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

    needShootToPlayer = () => {
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

    tick() {
        this.enemyShip.tick()
        this.playerShip.tick()
        Object.keys(this.visibleShots).forEach(shotId => this.visibleShots[shotId].tick())
    }
}

export default MainStage
