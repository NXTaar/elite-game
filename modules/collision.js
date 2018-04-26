import { Vector, Polygon, testPolygonPolygon } from 'sat'

class CollisionBody extends Polygon {
    constructor(points, { x, y, ...props }) {
        super(new Vector(x, y), points)
        Object.assign(this, props)
    }

    updatePosition(x, y) {
        this.pos = new Vector(x, y)
    }

    collision(target) {
        if (!target) throw new Error('cannot check collision with endefined target')

        return testPolygonPolygon(this, target)
    }
}

export const prepareCollisions = ({ hitbox, zeroPoint, x, y }) => hitbox ?
    hitbox.map(({ area, ...props }) => {
        let [zeroX, zeroY] = zeroPoint

        let preparedArea = area.map(({ x, y }) => new Vector(x - zeroX, y - zeroY))

        return new CollisionBody(preparedArea, { x, y, ...props })
    }) :
    []
