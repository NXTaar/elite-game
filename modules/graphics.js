import { observable, autorun, computed } from 'mobx'

export class Point extends PIXI.Graphics {
    @observable color

    @observable size

    constructor({ color, size = 2 }) {
        super()
        Object.assign(this, { color, size })
        autorun(this.draw)
    }

    draw = () => {
        this.clear()
        this.beginFill(parseInt(`0x${this.color}`, 16))
        this.drawCircle(0, 0, this.size)
        this.endFill()
    }
}

export class Rectangle extends PIXI.Graphics {
    @observable _width

    @observable _height

    @observable color

    get width() {
        return this._width
    }

    set width(value) {
        this._width = value
    }

    get height() {
        return this._height
    }

    set height(value) {
        this._height = value
    }

    constructor({ color, width, height }) {
        super()
        Object.assign(this, { color, width, height })
        autorun(this.draw)
    }

    draw = () => {
        this.clear()
        this.beginFill(parseInt(`0x${this.color}`, 16))
        this.drawRect(0, 0, this.width, this.height)
        this.endFill()
    }
}

export class Polygon extends PIXI.Graphics {
    @observable points = []

    @observable color

    @observable size

    @computed get start() {
        return this.points[0]
    }

    @computed get figure() {
        return [
            ...this.points.slice(1),
            this.points[0]
        ]
    }

    constructor({ points, color = 'ffffff', size = 1 }) {
        super()
        Object.assign(this, { points, color, size })
        autorun(this.draw)
    }

    draw = () => {
        this.clear()
        this.lineStyle(this.size, parseInt(`0x${this.color}`, 16))

        this.moveTo(this.start.x, this.start.y)
        this.figure.forEach(({ x, y }) => this.lineTo(x, y))
    }
}
