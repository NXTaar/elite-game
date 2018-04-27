import * as components from '@components'

const componentsPriorityOrder = [
    'GameObject',
    'StateMachine',
    'Hitbox',
    'Firepoint',
    'Projectile',
    'Movement',
    'Fader',
    'Ticker'
]

const processors = {
    sprite: 'GameObject',
    movement: 'Movement',
    states: 'StateMachine',
    projectile: 'Projectile'
}

const buildComponentSet = setup => Array.isArray(setup) ? buildFromArray(setup) : buildFromObject(setup)

const buildFromObject = setup => {
    let componentsRegister = Object.keys(setup).reduce((res, propName) => ({
        ...res,
        setups: {
            ...res.setups,
            ...processors[propName] && {
                [processors[propName]]: setup[propName]
            },
            ...propName === 'common' && setup.common.reduce((res, componentName) => ({
                ...res,
                [componentName]: {}
            }), {})
        },
        static: {
            ...res.static,
            ...!processors[propName] && propName !== 'common' && {
                [propName]: setup[propName]
            }
        }
    }), {
        setups: {},
        static: {}
    })

    return componentsPriorityOrder.reduce((build, componentName) => {
        let component = componentsRegister.setups[componentName] && components[componentName]
        let params = componentsRegister.setups[componentName]

        return {
            ...build,
            ...component && { ...component(params, build) }
        }
    }, componentsRegister.static)
}

const buildFromArray = setup => setup.reduce((build, { component, ...params }) => ({
    ...build,
    ...component ? { ...component(params, build) } : { ...params }
}), {})

export default buildComponentSet
