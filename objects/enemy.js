import GameObject from '@modules/object'
import { StateMachine } from '@modules/state-machine'
import { linearMoveAsync } from '@modules/movements'

const gap = 10

class Enemy extends GameObject {
    constructor({
        position,
        textureName = 'ShipSidewinder',
        borders,
        attackFn = () => {},
        attackCondition = () => false,
        anchor = [0.5, 0.5]
    }) {
        super({ position, textureName, anchor })
        this.startPosition = position
        this.unit.position.y = this.unit.height * -1
        this.unit.rotation = Math.PI

        let [aX, aY] = this.anchorXY

        this.firePoints = this.config.firepoint.map(({ x, y }) => ({
            x: x - aX,
            y: y - aY
        }))

        this.sm = new StateMachine([
            {
                name: 'appearingOnTop',
                initial: true,
                action: this.appearOnTop
            },
            {
                name: 'movingToLeftBorder',
                action: this.moveToBorder('left')
            },
            {
                name: 'movingToRightBorder',
                action: this.moveToBorder('right')
            },
            {
                name: 'attackingPlayer',
                action: attackFn,
                enterCondition: attackCondition
            }
        ])

        this.borderSetups = {
            left: {
                x: 0 + gap + this.unit.width / 2,
                nextState: 'movingToRightBorder'
            },
            right: {
                x: borders.width - gap - this.unit.width / 2,
                nextState: 'movingToLeftBorder'
            }
        }
    }

    appearOnTop = async ({ out, enter }) => {
        await linearMoveAsync(this.unit, { destination: this.startPosition, speed: 2 })

        out()
        enter(Math.random() >= 0.5 ? 'movingToLeftBorder' : 'movingToRightBorder')
    }

    // вынести отдельно чтобы можно было собирать поведение из "кусочков"
    moveToBorder = direction => async ({ out, enter }) => {
        let { x, nextState } = this.borderSetups[direction]
        let { y } = this.unit

        await linearMoveAsync(this.unit, { destination: [x, y], speed: 4 })

        out()
        enter(nextState)
    }

    tick() {
        this.sm.render()
    }
}

export default Enemy
