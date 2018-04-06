import { getMousePosition } from '@modules/mouse'
import Vector from '@modules/vector'

let speed = 9
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

export const linearMove = (object, {
    destination: [dX, dY],
    speed = 1,
    end
    // delta
} = {}) => {
    let { x: oX, y: oY } = object
    let movement = new Vector(object, { x: dX, y: dY })
    let N = movement.normalize()

    let nX = oX + N.x * speed
    let nY = oY + N.y * speed

    let prediction = new Vector(object, { x: nX, y: nY })

    let bias = [nX, nY]

    let overStepMove = prediction.magnitude > movement.magnitude

    overStepMove && (bias = [dX, dY])

    object.position.set(...bias);

    (N.x === 0 && N.y === 0 || overStepMove) && end()
}


export const linearMoveAsync = (object, params) => new Promise(res => linearMove(object, { ...params, end: res }))
