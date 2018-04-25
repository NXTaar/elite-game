import GameObject from '@modules/object'

class PlayerShip extends GameObject {
    constructor({
        position,
        textureName = 'ShipCobra',
        anchor = [0.5, 0.5]
    }) {
        super({ position, textureName, anchor })
        let [aX, aY] = this.anchorXY

        this.firePoints = this.config.firepoint.map(({ x, y }) => ({
            x: x - aX,
            y: y - aY
        }))
    }

    // tick() {

    // }
}

export default PlayerShip
