import app from './app'

export const getMousePosition = () => ({
    ...app.renderer.plugins.interaction.mouse.global
})

export const getCoordinatesString = (point) => {
    point = point || {}
    return typeof point.x === 'number' && typeof point.y === 'number' ?
        `x: ${point.x} | y: ${point.y}` :
        ''
}