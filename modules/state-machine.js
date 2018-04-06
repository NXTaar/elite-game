export class StateMachine {
    constructor(stateSetups = []) {
        this.statesStack = []
        let { states, initial } = stateSetups.reduce((res, state) => {
            state.name && (res.states[state.name] = {
                ...state,
                outFn: this.outState(state.name)
            })

            state.initial && (res.initial = state.name)

            return res
        }, { states: {}, initial: null })

        Object.assign(this, { states })

        this.enterState(initial)
    }

    enterState = name => {
        let stateToEnter = this.states[name]

        stateToEnter && this.statesStack.unshift(stateToEnter)
    }

    outState = name => () => {
        let currentState = this.statesStack[0]

        currentState && currentState.name === name && this.statesStack.shift()
    }

    sync() {
        let currentState = this.statesStack[0]

        currentState && currentState.action({
            out: currentState.outFn,
            enter: this.enterState
        })
    }
}
