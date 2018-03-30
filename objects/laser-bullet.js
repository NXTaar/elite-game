


import GameObject from '@modules/object'
import { getCanvasSize } from '@modules/resize'

const LASER_SPEED = 14;

class LaserBullet extends GameObject {
    constructor({
        position,
        textureName = 'LaserBullet',
        anchor = [0.5, 0.5]
    } = {}) {
        super({ position, textureName, anchor })
        this.speed = 0
        this.inSight = true
        this.direction = -1
    }

    changeDirection() {
        this.direction = this.direction * -1
    }

    fire(speed) {
        this.speed = speed || LASER_SPEED
    }

    onPositionChange() {
        this.calculateInSight()
    }

    calculateInSight() {
        let { height: sceneHeight } = getCanvasSize()

        let yCheck = this.unit.y + this.unit.height * -0.5 * this.direction

        this.inSight = (yCheck >= 0) && (yCheck <= sceneHeight)
    }

    stop() {
        this.speed = 0
    }

    tick() {
        if (this.speed === 0) return
        this.position(null, this.unit.y + this.speed * this.direction)
    }

}

export default LaserBullet