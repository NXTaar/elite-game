import { observable, computed } from 'mobx'

class Vector {
    static fromPoints({ x: bX, y: bY }, { x: eX, y: eY }) {
        return new Vector(eX - bX, eY - bY)
    }

    @observable x

    @observable y

    @computed get magnitude() {
        let { x, y } = this

        return Math.sqrt(x * x + y * y)
    }

    set magnitude(value) {
        let N = this.normale

        N.multiply(value)

        this.x = N.x
        this.y = N.y
    }

    set orientation(angle) {
        let basis = new Vector(0, -1)

        basis.rotate(angle)

        basis.magnitude = this.magnitude

        this.assign(basis)
    }

    @computed get normale() {
        let { x, y, magnitude: m } = this

        return m === 0 ? this : new Vector(x / m, y / m)
    }

    @computed get debugString() {
        return `x:${this.x} y:${this.y} m:${this.magnitude}`
    }

    @computed get isNull() {
        return this.x === 0 && this.y === 0
    }

    constructor(x = 0, y = 0) {
        Object.assign(this, { x, y })
    }

    assign({ x, y }) {
        Object.assign(this, { x, y })
    }

    multiply(multiplier) {
        this.x *= multiplier
        this.y *= multiplier
    }

    add(vector) {
        this.x += vector.x
        this.y += vector.y
    }

    angleTo(vector) {
        let A = this.normale
        let B = vector.normale

        return Math.acos(A.dot(B))
    }

    dot(vector) {
        return this.x * vector.x + this.y * vector.y
    }

    subtract(vector) {
        this.x -= vector.x
        this.y -= vector.y
    }

    rotate(angle) {
        let ca = Math.cos(angle)
        let sa = Math.sin(angle)
        let x = this.x * ca - this.y * sa
        let y = this.x * sa + this.y * ca

        Object.assign(this, { x, y })
    }
}

export default Vector
