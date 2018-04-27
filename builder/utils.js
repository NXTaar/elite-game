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

exports.parsePairIntArray = arr => arr.split(';').map(int => parseFloat(int))

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
