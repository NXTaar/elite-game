export default class Vector {
    static getMagnitude = (x, y) => Math.sqrt(x * x + y * y)

    static normalize = ({ magnitude, ...vector }) => {
        let normalized = { ...vector }
        let { x, y } = vector
        let isZero = x === 0 && y === 0

        if (isZero) return normalized

        let m = magnitude || Vector.getMagnitude(x, y)

        return {
            x: x / m,
            y: y / m
        }
    }

    static fromCoordinates(x, y) {
        return new Vector({ x: 0, y: 0 }, { x, y })
    }

    constructor(begin, end) {
        this.x = end.x - begin.x
        this.y = end.y - begin.y

        this.magnitude = Vector.getMagnitude(this.x, this.y)
    }

    normalize() {
        let { x, y } = Vector.normalize(this)

        return Vector.fromCoordinates(x, y)
    }
}
