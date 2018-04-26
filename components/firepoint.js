const Firepoint = (params, { zeroPoint, config: { firepoint } }) => {
    let [zeroX, zeroY] = zeroPoint

    let firepoints = firepoint.map(({ x, y }) => ({
        x: x - zeroX,
        y: y - zeroY
    }))

    return { firepoints }
}

Firepoint.id = 'Firepoint'

export default Firepoint
