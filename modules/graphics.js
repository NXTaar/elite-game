// import app from './app'

export const drawPoint = color => {
    let point = new PIXI.Graphics()

    point.beginFill(parseInt(`0x${color}`, 16))
    point.drawCircle(0, 0, 2)
    point.endFill()

    return point
}
