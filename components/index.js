let objectsFolder = require.context('./', false, /^((?!index).)*\.js$/)

objectsFolder.keys().forEach(path => {
    let module = objectsFolder(path).default

    module.id && (exports[module.id] = module)
})
