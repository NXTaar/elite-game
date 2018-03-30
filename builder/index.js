const path = require('path')
const parseTypes = require('./parsers')
const JSONWatcher = require('./watcher')

const resultJson = 'assets.json'
const jsonPath = path.resolve('./assets/json')
const tiledJson = path.resolve(jsonPath, 'tiled-raw.json')


function processTiledJSON({ tiles: objectsRaw }) {
    return Object.keys(objectsRaw).reduce((res, key) => {
        let setup = objectsRaw[key]
        let { type } = setup

        typeof parseTypes[type] === 'function' && (res = {
            ...res,
            ...parseTypes[type](setup)
        })

        return res
    }, {})
}

new JSONWatcher({
    entry: tiledJson,
    output: path.resolve(jsonPath, resultJson),
    processor: processTiledJSON
})
