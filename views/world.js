import { linearMoveAsync } from '@modules/movements'
import View from '@modules/view'
import keyboard from '@modules/keyboard'
import { Segment } from '@modules/graphics'

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
                    // interaction: ['pointerdown', this.handlePlayerShooting],
                    config: this.config.ShipCobra,
                    sprite: {
                        texture: this.assets.ShipCobra,
                        position: [400, 520]
                        // rotation: 0.3
                    },
                    thrusters: {
                        // assist: false,
                        mass: 5,
                        power: 1
                    },
                    states: [
                        {
                            name: 'thrustersIdle',
                            initial: true,
                            action: () => {
                                this.playerShip.thrusters.input = {}
                            }
                        },
                        {
                            name: 'thrustersMoving',
                            action: ({ out }) => {
                                let keyMap = {
                                    'a': 'ccw',
                                    'd': 'cw',
                                    'w': 'up',
                                    's': 'down',
                                    'q': 'left',
                                    'e': 'right'
                                }

                                Object.keys(keyMap).forEach(key => {
                                    keyboard.pressedKeys[key] && (this.playerShip.thrusters.input[keyMap[key]] = true)
                                })
                                out()
                            },
                            enterCondition: () => [
                                keyboard.pressedKeys.e,
                                keyboard.pressedKeys.q,
                                keyboard.pressedKeys.w,
                                keyboard.pressedKeys.a,
                                keyboard.pressedKeys.s,
                                keyboard.pressedKeys.d
                            ].some(v => v)

                        }
                    ],
                    // movement: {
                    //     type: 'followMouseX',
                    //     gapFromBorder: this.config.ShipCobra.gap,
                    //     speed: 8,
                    //     width: 800
                    // },
                    common: [
                        'Firepoint',
                        'Hitbox',
                        'Ticker'
                    ]
                }
            }
            // {
            //     attach: 'enemyShip',
            //     node: {
            //         id: 'enemy',
            //         ship: 'sidewinder',
            //         borderSetups: {
            //             left: {
            //                 x: 0 + this.config.ShipSidewinder.gap + this.config.ShipSidewinder.width / 2,
            //                 nextState: 'movingToRightBorder'
            //             },
            //             right: {
            //                 x: 800 - this.config.ShipSidewinder.gap - this.config.ShipSidewinder.width / 2,
            //                 nextState: 'movingToLeftBorder'
            //             }
            //         },
            //         config: this.config.ShipSidewinder,
            //         sprite: {
            //             texture: this.assets.ShipSidewinder,
            //             position: [400, this.config.ShipSidewinder.height * -1],
            //             rotation: Math.PI
            //         },
            //         states: [
            //             {
            //                 name: 'appearingOnTop',
            //                 initial: true,
            //                 action: this.enemyAppearOnTop
            //             },
            //             {
            //                 name: 'movingToLeftBorder',
            //                 action: this.enemyMoveToBorder('left')
            //             },
            //             {
            //                 name: 'movingToRightBorder',
            //                 action: this.enemyMoveToBorder('right')
            //             },
            //             {
            //                 name: 'attackingPlayer',
            //                 action: this.attackPlayer,
            //                 enterCondition: this.isPlayerOnFireLine,
            //                 cantEnterAfter: ['appearingOnTop']
            //             }
            //         ],
            //         common: [
            //             'Firepoint',
            //             'Hitbox',
            //             'Ticker'
            //         ]
            //     }
            // }
        ]
    }

    ready() {
        this.velocity = new Segment({
            size: 2,
            color: '53f441'
        })
        this.accTang = new Segment({
            size: 2,
            color: '2d00f9'
        })
        this.accNorm = new Segment({
            size: 2,
            color: 'ff0000'
        })
        // this.direction = new Segment({
        //     size: 2,
        //     color: 'ef5b00'
        // })
        // this.addChild(this.radius)
        this.addChild(this.velocity)
        // this.addChild(this.accTang)
        this.addChild(this.accNorm)
    }

    tick(delta) {
        // this.enemyShip.tick()
        this.playerShip.tick(delta)

        this.velocity.start = this.playerShip.$
        this.accTang.start = this.playerShip.$
        this.accNorm.start = this.playerShip.$

        // this.direction.start = this.playerShip.$

        this.velocity.end = {
            x: this.playerShip.$.x + this.playerShip.thrusters.v.x * 10,
            y: this.playerShip.$.y + this.playerShip.thrusters.v.y * 10
        }

        // this.accTang.end = {
        //     x: this.playerShip.$.x + this.playerShip.thrusters.accTang.x * 300,
        //     y: this.playerShip.$.y + this.playerShip.thrusters.accTang.y * 300
        // }

        this.accNorm.end = {
            x: this.playerShip.$.x + this.playerShip.thrusters.accNorm.x,
            y: this.playerShip.$.y + this.playerShip.thrusters.accNorm.y
        }
        // this.direction.end = {
        //     x: this.playerShip.$.x + this.playerShip.thrusters.direction.x * 70,
        //     y: this.playerShip.$.y + this.playerShip.thrusters.direction.y * 70
        // }
        // this.explosion.tick(delta)
        // Object.keys(this.visibleShots).forEach(shotId => this.visibleShots[shotId].tick())
    }
}

export default World
