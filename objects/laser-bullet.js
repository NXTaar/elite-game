import GameObject from '@modules/object'
import { getCanvasSize } from '@modules/resize'

const LASER_SPEED = 14

class LaserBullet extends GameObject {
    constructor({
        position,
        textureName = 'LaserBullet',
        anchor = [0.5, 0.5],
        checkHit,
        direction = -1
    } = {}) {
        super({ position, textureName, anchor })
        this.speed = 0
        this.inSight = true
        this.isHit = false
        this.direction = direction
        this.checkHit = checkHit
        this.random = Math.random()
    }

    changeDirection(direction) {
        this.direction = direction || this.direction * -1
    }

    fire(speed) {
        this.isHit = false
        this.speed = speed || LASER_SPEED
        this.unit.visible = true
    }

    hit() {
        this.isHit = true
        this.unit.visible = false
    }

    onPositionChange() {
        this.calculateInSight()
    }

    calculateInSight() {
        let { height: sceneHeight } = getCanvasSize()

        let yCheck = this.unit.y + this.unit.height * -0.5 * this.direction

        this.inSight = yCheck >= 0 && yCheck <= sceneHeight
    }

    stop() {
        this.speed = 0
    }

    tick() {
        if (this.speed === 0 || this.isHit) return

        typeof this.checkHit === 'function' && this.checkHit(this)

        this.position(null, this.unit.y + this.speed * this.direction)
    }
}

export default LaserBullet
