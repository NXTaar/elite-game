const { kebabToClassCamelcase } = require('./utils')

const parseTypes = {
    'object': ({ image, objectgroup: { objects } }) => {
        let objectName = kebabToClassCamelcase(image)
        let parsed = objects.reduce((res, setup) => {
            let { type } = setup
            let hasParserForType = typeof parseTypes[type] === 'function'

            if (hasParserForType) {
                res[type] = res[type] || []
                res[type].push(parseTypes[type](setup))
            }

            return res
        }, {})

        return {
            [objectName]: parsed
        }
    },

    'firepoint': ({ x, y, name }) => ({ x, y, name }),

    'hitbox': ({ polygon, x, y }) => ({
        area: polygon.map(({ x: pX, y: pY }) => ({
            x: x + pX,
            y: y + pY
        }))
    })
}

module.exports = parseTypes
