import { observable, autorun } from 'mobx'

class State {
    @observable currentStage = 'game'

    @observable playerHits = {}

    @observable enemyHits = {}

    react(fn) {
        return autorun(fn)
    }
}

export default new State()
