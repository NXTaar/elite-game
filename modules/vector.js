export default class Vector {
    static getMagnitude = (x, y) => Math.sqrt(x * x + y * y)

    static normalize = vector => {
        let normalized = { ...vector }
        let { x, y } = vector
        let isZero = x === 0 && y === 0

        if (isZero) return normalized

        let m = Vector.getMagnitude(x, y)

        return {
            x: x / m,
            y: y / m
        }
    }
}
