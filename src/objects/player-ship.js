import GameObject from '@modules/object'


class PlayerShip extends GameObject {
    constructor({
        position,
        textureName = 'ShipCobra',
        anchor = [0.5, 0.5]
    }) {
        super({ position, textureName, anchor })
    }

    tick() {

    }
}

export default PlayerShip