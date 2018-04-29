exports.kebabToClassCamelcase = str => str.match(/([^/]+)(?=\.\w+$)/)[0]
    .toLowerCase()
    .replace(/(\b|-)\w/g, m => m.toUpperCase().replace(/-/, ''))

exports.debounce = (func, wait, immediate) => {
    let timeout

    return function(...args) {
        let context = this

        let later = () => {
            timeout = null
            if (!immediate) func.apply(context, args)
        }

        let callNow = immediate && !timeout

        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
        if (callNow) func.apply(context, args)
    }
}

exports.isColor = raw => /^#(?:[0-9a-fA-F]{3}){1,2}$/g.test(raw)

exports.parseParamsArray = arr => arr.split(';').map(param => {
    let parsed = parseFloat(param)

    exports.isColor(param) && (param = parseInt(`0x${param.slice(1)}`, 16))

    return isNaN(parsed) ? param : parsed
})

exports.mapPolygon = ({ points, x, y }) => points.map(({ x: pX, y: pY }) => ({
    x: x + pX,
    y: y + pY
}))

exports.parseCustomPropeties = ({
    rawProps = {},
    parseTypes = {},
    initial = {}
}) => ({ ...Object.keys(rawProps).reduce((res, propName) => ({
    ...res,
    ...parseTypes[propName] ?
        { [propName]: parseTypes[propName](rawProps[propName]) } :
        { [propName]: rawProps[propName] }
}), initial) })
