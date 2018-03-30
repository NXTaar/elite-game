const buildPrivateProps = propNames => {
    return propNames.reduce((res, name) => {
        res[name] = Symbol(name);

        return res;
    }, {});
};

export default buildPrivateProps