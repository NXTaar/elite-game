let imagesFolder = require.context('../../assets', true, /[^favicon]\.png/)

let images = imagesFolder.keys().forEach(path => {
    let imageName = path.match(/([^\/]+)(?=\.\w+$)/)[0]
        .toLowerCase()
        .replace(/(\b|-)\w/g, m => m.toUpperCase().replace(/-/, ''))

    exports[imageName] = imagesFolder(path)
})