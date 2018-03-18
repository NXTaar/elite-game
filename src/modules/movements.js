import { getMousePosition } from '@modules/mouse'

let speed = 5
let speedLimit = 1000
let boundGap = 20

export const followMouseX = (object, { width }) => {
    let { x: mX } = getMousePosition()
    let { x: pX } = object

    let rightBorder = width - object.width * 0.5 - boundGap
    let leftBorder = 0 + object.width * 0.5 + boundGap

    let vx = mX - pX

    let direction = vx > 0 ? 'right' : 'left'

    object.x += vx * speed / speedLimit

    if (direction === 'right' && mX >= rightBorder) {
        object.x += (rightBorder - pX) * speed / speedLimit
        object.x > rightBorder && (object.x = rightBorder)
    }

    if (direction === 'left' && mX <= leftBorder) {
        object.x += (leftBorder - pX) * speed / speedLimit
        object.x < leftBorder && (object.x = leftBorder)
    }
}