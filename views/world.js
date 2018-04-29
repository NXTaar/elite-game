import { linearMoveAsync } from '@modules/movements'
import View from '@modules/view'

class World extends View {
    constructor(props) {
        super(props)
        this.visibleShots = {}
        this.shotsRecycle = []
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
        this.compileObject({
            addToStage: true,
            id: Math.random(),
            config: this.config.LaserBullet,
            sprite: {
                texture: this.assets.LaserBullet
            },
            projectile: {
                height: 600,
                onOutOfSight: this.handleLaserShotOutOfSight,
                onHit: this.handleLaserHit,
                speed: 15
            },
            common: [
                'Hitbox',
                'Ticker'
            ]
        })

    handleLaserShotOutOfSight = shot => this.recycleShot(shot.id)

    handleLaserHit = ({ zone, side = '', targetId }, { $, id }) => {
        $.visible = false
        this.recycleShot(id)
        this.state[`${targetId}Hits`][zone + side].hit = true
    }

    fireLaser = (shooter, target) => shooter.firepoints.forEach(firepoint => {
        let shot = this.getLaserObject()

        shot.$.visible = true
        shot.target = target
        shot.direction = shooter.id === 'player' ? -1 : 1
        shot.move(shooter.$.x + firepoint.x, shooter.$.y + firepoint.y)

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

    prepare() {
        return [
            {
                node: {
                    sprite: {
                        texture: this.assets.Background
                    }
                }
            },
            {
                attach: 'playerShip',
                node: {
                    id: 'player',
                    ship: 'cobra_mk3',
                    interaction: ['pointerdown', this.handlePlayerShooting],
                    config: this.config.ShipCobra,
                    sprite: {
                        texture: this.assets.ShipCobra,
                        position: [400, 520]
                    },
                    movement: {
                        type: 'followMouseX',
                        gapFromBorder: this.config.ShipCobra.gap,
                        speed: 8,
                        width: 800
                    },
                    common: [
                        'Firepoint',
                        'Fader',
                        'Hitbox',
                        'Ticker'
                    ]
                }
            },
            {
                attach: 'enemyShip',
                node: {
                    id: 'enemy',
                    ship: 'sidewinder',
                    borderSetups: {
                        left: {
                            x: 0 + this.config.ShipSidewinder.gap + this.config.ShipSidewinder.width / 2,
                            nextState: 'movingToRightBorder'
                        },
                        right: {
                            x: 800 - this.config.ShipSidewinder.gap - this.config.ShipSidewinder.width / 2,
                            nextState: 'movingToLeftBorder'
                        }
                    },
                    config: this.config.ShipSidewinder,
                    sprite: {
                        texture: this.assets.ShipSidewinder,
                        position: [400, this.config.ShipSidewinder.height * -1],
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
                }
            }
        ]
    }

    tick(delta) {
        this.enemyShip.tick()
        this.playerShip.tick(delta)
        // this.explosion.tick(delta)
        Object.keys(this.visibleShots).forEach(shotId => this.visibleShots[shotId].tick())
    }
}

export default World
