// import app from './app'

export const drawPoint = color => {
    let point = new PIXI.Graphics()

    point.beginFill(parseInt(`0x${color}`, 16))
    point.drawCircle(0, 0, 2)
    point.endFill()

    return point
}

export const drawPolygon = ({ points, color, size = 1 }) => {
    let polygon = new PIXI.Graphics()

    polygon.lineStyle(size, parseInt(`0x${color}`, 16))
    let start = points.shift()

    polygon.moveTo(start.x, start.y)
    points.forEach(({ x, y }) => polygon.lineTo(x, y))

    return polygon
}
