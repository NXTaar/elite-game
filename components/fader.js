import { createLinearInterpolation } from '@modules/interpolation'

const Fader = () => ({
    fade({ to, duration }) {
        let from = this.$.alpha
        let id = `fading-${from}to${to}-rand:${Math.random}`

        this.loopActions = this.loopActions || []

        return new Promise(res => {
            let interpolate = createLinearInterpolation({
                from,
                to,
                duration
            })

            this.loopActions.push({
                id,
                action: doFade({ interpolate, to, res, id })
            })
        })
    }
})


const doFade = ({ interpolate, to, res, id }) => (target, delta) => {
    target.$.alpha = interpolate(delta)

    if (target.$.alpha !== to) return

    target.loopActions = target.loopActions.filter(act => act.id !== id)

    res()
}

Fader.id = 'Fader'

export default Fader
