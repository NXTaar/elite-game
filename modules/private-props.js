const buildPrivateProps = propNames => propNames.reduce((res, name) => {
    res[`private_${name}`] = Symbol(name)

    return res
}, {})

export default buildPrivateProps
