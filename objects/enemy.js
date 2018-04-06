import GameObject from '@modules/object'
import { StateMachine } from '@modules/state-machine'
import { linearMoveAsync } from '@modules/movements'

const gap = 10

class Enemy extends GameObject {
    constructor({
        position,
        textureName = 'ShipSidewinder',
        borders,
        anchor = [0.5, 0.5]
    }) {
        super({ position, textureName, anchor })
        this.startPosition = position
        this.unit.position.y = this.unit.height * -1
        this.unit.rotation = Math.PI

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

    moveToBorder = direction => async ({ out, enter }) => {
        let { x, nextState } = this.borderSetups[direction]
        let { y } = this.unit

        await linearMoveAsync(this.unit, { destination: [x, y], speed: 4 })

        out()
        enter(nextState)
    }

    tick() {
        this.sm.sync()
    }
}

export default Enemy
