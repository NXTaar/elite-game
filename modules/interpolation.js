export const createLinearInterpolation = ({ duration, from, to }) => {
    let time = 0
    let dx = to - from

    return delta => {
        time += deltaToMs(delta)

        if (time > duration) return to

        return dx * time / duration + from
    }
}

export const deltaToMs = delta => 1000 / 60 * delta
