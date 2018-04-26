const { kebabToClassCamelcase } = require('./utils')

const parseTypes = {
    'object': ({ image, imageheight: height, imagewidth: width, objectgroup: { objects } }, rawCustomProperties = {}) => {
        let objectName = kebabToClassCamelcase(image)

        let parsedCustomProperties = { ...Object.keys(rawCustomProperties).reduce((res, propName) => ({
            ...res,
            ...parseTypes[propName] ?
                { [propName]: parseTypes[propName](rawCustomProperties[propName]) } :
                { [propName]: rawCustomProperties[propName] }
        }), { name: objectName, height, width }) }

        let parsed = objects.reduce((res, setup) => {
            let { type } = setup
            let hasParserForType = typeof parseTypes[type] === 'function'

            if (hasParserForType) {
                res[type] = res[type] || []
                res[type].push(parseTypes[type](setup))
            }

            return res
        }, parsedCustomProperties)

        return {
            [objectName]: parsed
        }
    },

    'anchor': raw => raw.split(';').map(int => parseFloat(int)),

    'firepoint': ({ x, y, name }) => ({ x, y, name }),

    'hitbox': ({ polygon, x, y, properties: { zone, side } = {} }) => ({
        area: polygon.map(({ x: pX, y: pY }) => ({
            x: x + pX,
            y: y + pY
        })),
        ...zone && { zone },
        ...side && { side }
    })
}

module.exports = parseTypes
