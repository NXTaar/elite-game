import Vector from '@modules/vector'
import { noop } from '@modules/utils'

export const linearMove = (object, {
    destination: [dX, dY],
    speed = 1,
    end = noop
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
