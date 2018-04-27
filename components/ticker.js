const Ticker = () => ({
    tick(delta) {
        this.loopActions && this.loopActions.length > 0 && this.loopActions
            .filter(({ condition }) => typeof condition === 'function' ? condition() : true)
            .forEach(({ action }) => action(this, delta))
    }
})


Ticker.id = 'Ticker'

export default Ticker
