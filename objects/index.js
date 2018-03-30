import { kebabToClassCamelcase } from '@modules/utils'

let objectsFolder = require.context('./', false, /^((?!index).)*\.js$/)

objectsFolder.keys().forEach(path => {
    let objectName = kebabToClassCamelcase(path)

    exports[objectName] = objectsFolder(path).default
})