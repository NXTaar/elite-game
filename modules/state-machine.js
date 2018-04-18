export class StateMachine {
    constructor(stateSetups = []) {
        this.statesStack = []
        let { states, initial, enterConditions } = stateSetups.reduce((res, state) => {
            state.name && (res.states[state.name] = {
                ...state,
                outFn: this.outState(state.name)
            })

            state.initial && (res.initial = state.name)

            typeof state.enterCondition === 'function' && res.enterConditions.push({
                name: state.name,
                condition: state.enterCondition
            })

            return res
        }, {
            states: {},
            initial: null,
            enterConditions: []
        })

        Object.assign(this, { states, enterConditions })

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

    render() {
        let currentState = this.statesStack[0]

        currentState && currentState.action({
            out: currentState.outFn,
            enter: this.enterState
        })

        this.enterConditions.forEach(({ name, condition }) => {
            condition() && this.enterState(name)
        })
    }
}
