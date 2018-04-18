import { Vector, Polygon, testPolygonPolygon } from 'sat'

class CollisionBody extends Polygon {
    constructor(points, { x, y }) {
        super(new Vector(x, y), points)
    }

    updatePosition(x, y) {
        this.pos = new Vector(x, y)
    }

    collision(target) {
        if (!target) throw new Error('cannot check collision with endefined target')

        return testPolygonPolygon(this, target)
    }
}


export default CollisionBody

export const prepareCollisions = ({ hitbox, anchor }, { width, height, x, y }) => {
    let collisionBodies = hitbox ?
        hitbox.map(({ area }) => {
            let preparedArea = prepareHitbox({ area, width, height, anchor })

            return new CollisionBody(preparedArea, { x, y })
        }) :
        []

    return { collisionBodies }
}

export const prepareHitbox = ({
    area,
    width,
    height,
    anchor = [0, 0]
}) => {
    let [zeroX, zeroY] = [width * anchor[0], height * anchor[1]]

    return area.map(({ x, y }) => new Vector(x - zeroX, y - zeroY))
}
