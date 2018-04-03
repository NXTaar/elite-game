import GameObject from '@modules/object'

class Enemy extends GameObject {
    constructor({
        position,
        textureName = 'ShipSidewinder',
        anchor = [0.5, 0.5]
    }) {
        super({ position, textureName, anchor })
        this.unit.rotation = Math.PI

        this.unit.position.y = -40

        this.startMovement('linearMove', {
            destination: position
        })
    }
}

export default Enemy
