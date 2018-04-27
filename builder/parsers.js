const { kebabToClassCamelcase, parseCustomPropeties, parsePairIntArray } = require('./utils')

const parseTypes = {
    'object': ({ image, imageheight: height, imagewidth: width, objectgroup: { objects } }, rawProps = {}) => {
        let objectName = kebabToClassCamelcase(image)

        let parsedCustomProperties = parseCustomPropeties({
            rawProps,
            parseTypes,
            initial: { name: objectName, height, width }
        })

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

    'animated-object': ({ image, imageheight: height, imagewidth: width }, rawProps) => {
        let objectName = kebabToClassCamelcase(image)

        let { frame, ...props } = parseCustomPropeties({
            rawProps,
            parseTypes
        })

        let [frameWidth, frameHeight] = frame
        let framesAmount = width / frameWidth

        let frames = new Array(framesAmount).fill(null).map((_, index) => ({
            x: frameWidth * index,
            y: 0,
            width: frameWidth,
            height: frameHeight,
            name: `${objectName}_${index + 1}`
        }))

        return {
            [objectName]: {
                frames,
                width: frameWidth,
                height: frameHeight,
                ...props
            }
        }
    },

    'frame': parsePairIntArray,

    'anchor': parsePairIntArray,

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
