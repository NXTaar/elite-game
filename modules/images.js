let imagesFolder = require.context('../assets', true, /^((?!favicon).)*\.png$/)

let images = imagesFolder.keys().reduce((res, path) => {
    let imageName = path.match(/([^/]+)(?=\.\w+$)/)[0]
        .toLowerCase()
        .replace(/(\b|-)\w/g, m => m.toUpperCase().replace(/-/, ''))

    return {
        ...res,
        [imageName]: imagesFolder(path)
    }
}, {})

export const imageFiles = Object.keys(images).reduce((res, imageName) => [
    ...res,
    images[imageName]
], [])

export const imagesByFilename = Object.keys(images).reduce((res, imageName) => ({
    ...res,
    [images[imageName]]: imageName
}), {})

export default images
