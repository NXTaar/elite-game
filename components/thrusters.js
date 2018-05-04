import Vector from '@modules/vector'

const Thrusters = ({
    power = 1,
    mass = 1,
    assist = true,
    angularLimit = 1, // rounds per second
    linearLimit = 5
}, object) => {
    object.loopActions = object.loopActions || []
    object.loopActions.push({
        id: 'thrustersMove',
        action: doThrustersMove
    })

    let R = object.$.width / 2
    let acceleration = power / mass
    let turnPower = acceleration * (1 / R)

    return {
        thrusters: {
            R,
            turnPower,
            linearLimit,
            angularLimit: angularLimit * (Math.PI / 30),
            acceleration,
            assist,
            accNorm: new Vector(),
            v: new Vector(),
            a: new Vector(),
            w: new Vector(),
            e: new Vector(),
            r: new Vector(),
            input: {},
            rotate: 0
        }
    }
}


const doThrustersMove = object => {
    let { assist, input } = object.thrusters
    let firing = Object.keys(input).length > 0
    let turning = !!(input.cw || input.ccw)
    let inputs = {
        x: !!input.right - !!input.left,
        y: !!input.down - !!input.up,
        w: !!input.cw - !!input.ccw
    }

    let setup = { object, firing, inputs, turning }

    return assist ? doAssistedMove(setup) : doNewtonianMove(setup)
}

const doAssistedMove = ({ object, firing, inputs, turning }) => {
    let { v, a, w, e, r, acceleration, R, linearLimit, accNorm } = object.thrusters

    object.$.x += e.x ? e.x - object.$.x : v.x
    object.$.y += e.y ? e.y - object.$.y : v.y
    object.$.rotation += w.y

    if (firing && !turning) {
        a.assign(inputs)
        a.multiply(acceleration)
        a.rotate(object.$.rotation)
    }

    e.assign({ x: 0, y: 0 })
    r.assign({ x: 0, y: -1 })
    w.y = 0
    accNorm.assign({ x: 0, y: 0 })

    if (turning && inputs.w !== 0) {
        let velocity = v.magnitude
        let angularVelocity = velocity / R

        r.rotate(object.$.rotation)

        let direction = Math.sign(r.dot(v))
        let turnAngle = angularVelocity * inputs.w * direction

        e.assign(v.normale)
        e.multiply(R * direction)
        e.assign({ x: inputs.w * -e.y, y: inputs.w * e.x })

        accNorm.assign(e)

        let center = {
            x: object.$.x + e.x,
            y: object.$.y + e.y
        }

        e.multiply(-1)
        e.rotate(turnAngle)
        v.rotate(turnAngle)
        e.assign({ x: center.x + e.x, y: center.y + e.y })

        w.y = turnAngle

        return
    }

    v.add(a)

    v.magnitude > linearLimit && (v.magnitude = linearLimit)

    if (firing) return

    let deceleration = v.normale

    deceleration.multiply(acceleration * -1)

    a.assign(deceleration)

    if (v.magnitude >= 0.1) return

    v.magnitude = 0
}

const doNewtonianMove = ({ object, inputs }) => {
    let { v, a, w, e, acceleration, turnPower, linearLimit, angularLimit } = object.thrusters

    object.$.x += v.x
    object.$.y += v.y
    object.$.rotation += w.y

    a.assign(inputs)
    a.multiply(acceleration)
    a.rotate(object.$.rotation)

    e.assign({ x: 0, y: inputs.w * turnPower })

    w.add(e)

    v.add(a)

    v.magnitude > linearLimit && (v.magnitude = linearLimit)

    w.magnitude > angularLimit && (w.magnitude = angularLimit)
}

Thrusters.id = 'Thrusters'

export default Thrusters
