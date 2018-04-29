import View from '@modules/view'
import { Rectangle, Polygon } from '@modules/graphics'
import { glowFilter } from '@modules/filters'

const filters = {
    player: [glowFilter({ color: 'd8742e' })],
    normal: [glowFilter({ color: 'd8742' })],
    damaged: [glowFilter({ color: 'ba1818' })]
}

class HUD extends View {
    prepareHitState(key, config) {
        this.state[key] = config.hitbox.reduce((res, { zone, side = '' }) => ({
            ...res,
            [zone + side]: {
                zone,
                side,
                hit: false
            }
        }), {})
    }

    syncHitzones = () => {
        Object.keys(this.state.playerHits).forEach(key => {
            let { hit } = this.state.playerHits[key]

            this.playerHitboxes[key].filters = hit ? filters.damaged : filters.normal
        })

        Object.keys(this.state.enemyHits).forEach(key => {
            let { hit } = this.state.enemyHits[key]

            this.enemyHitboxes[key].filters = hit ? filters.damaged : filters.normal
        })
    }

    prepare() {
        this.y = 600

        let playerShip = new PIXI.Container()
        let enemyShip = new PIXI.Container()

        // enemyShip.scale.set()
        playerShip.scale.set(0.7)
        playerShip.x = 200
        playerShip.y = 20

        enemyShip.x = 600
        enemyShip.y = 90
        enemyShip.rotation = Math.PI

        this.prepareHitState('playerHits', this.config.ShipCobra)
        this.prepareHitState('enemyHits', this.config.ShipSidewinder)

        this.playerHitboxes = this.config.ShipCobra.hitbox.reduce((res, { area, zone, side = '' }) => ({
            ...res,
            [zone + side]: new Polygon({ points: area, size: 2 })
        }), {})

        this.enemyHitboxes = this.config.ShipSidewinder.hitbox.reduce((res, { area, zone, side = '' }) => ({
            ...res,
            [zone + side]: new Polygon({ points: area, size: 1 })
        }), {})

        this.state.react(this.syncHitzones)

        return [
            {
                node: new Rectangle({ color: '0a223d', width: 800, height: 120 })
            },
            {
                node: playerShip,
                attach: 'player',
                children: [
                    {
                        node: {
                            sprite: {
                                texture: this.assets.ShipCobraHud,
                                filters: filters.player
                            }
                        }
                    },
                    ...Object.keys(this.playerHitboxes).map(key => ({ node: this.playerHitboxes[key] }))
                ]
            },
            {
                node: enemyShip,
                attach: 'enemy',
                children: [
                    {
                        node: {
                            sprite: {
                                texture: this.assets.ShipSidewinderHud,
                                filters: filters.player
                            }
                        }
                    },
                    ...Object.keys(this.enemyHitboxes).map(key => ({ node: this.enemyHitboxes[key] }))
                ]
            }
        ]
    }
}

export default HUD
