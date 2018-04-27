import { getMousePosition } from '@modules/mouse'
import { linearMove } from '@modules/movements'

const followMouseX = ({ gapFromBorder, speed, width, object }) => {
    let destination = {
        right: width - object.width * 0.5 - gapFromBorder,
        left: 0 + object.width * 0.5 + gapFromBorder
    }

    const action = () => {
        let { x: mX } = getMousePosition()
        let { x: pX } = object

        let direction = mX - pX > 0 ? 'right' : 'left'

        let destinationInside = destination.left <= mX && mX <= destination.right

        linearMove(object, {
            speed,
            destination: [destinationInside ? mX : destination[direction], object.y]
        })
    }

    // return action
    const condition = () => {
        let { x: mX } = getMousePosition()
        let { x: pX } = object

        let direction = mX - pX > 0 ? 'right' : 'left'

        return mX !== pX && pX !== destination[direction]
    }

    return { action, condition }
}

const movements = {
    followMouseX
}

const Movement = ({ type, ...movementParams }, build) => {
    let preparedMovement = null

    movements[type] && (preparedMovement = movements[type]({
        ...movementParams,
        object: build.$
    }))

    build.loopActions = build.loopActions || []

    preparedMovement && build.loopActions.push({
        id: type,
        ...preparedMovement
    })

    return build
}

Movement.id = 'Movement'

export default Movement
