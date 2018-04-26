const buildComponentSet = components => {
    let set = components.reduce((build, { component, ...params }) => ({
        ...build,
        ...component ? { ...component(params, build) } : { ...params }
    }), {})

    return set
}

export default buildComponentSet
