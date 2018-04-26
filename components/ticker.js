import { noop } from '@modules/utils'

const Ticker = (params, object) => ({
    tick: object.loopActions && object.loopActions.length > 0 ?
        tick :
        noop
})


function tick() {
    this.loopActions
        .filter(({ condition }) => typeof condition === 'function' ? condition() : true)
        .forEach(({ action }) => action(this))
}

Ticker.id = 'Ticker'

export default Ticker
