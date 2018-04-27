const fs = require('fs')
const chokidar = require('chokidar')
const defaultProcessor = data => data

module.exports = class AssetsWather {
    constructor({ processor = defaultProcessor, entry, output } = {}) {
        chokidar.watch(entry).on('all', this.writeFile.bind(this))
        Object.assign(this, { processor, output })
    }

    writeFile(evt, path) {
        let rawFile = fs.readFileSync(path, { encoding: 'utf8' }) || '{}'
        let processed = this.processor(JSON.parse(rawFile))

        fs.writeFileSync(this.output, JSON.stringify(processed, null, 2), 'utf8')
        console.log(`processed JSON written - ${this.output}`)
    }
}
