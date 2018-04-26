const gameObject = ({
    texture,
    position,
    rotation,
    position: [pX = 0, pY = 0] = []
}, {
    config: {
        anchor,
        width,
        height,
        anchor: [aX = 0, aY = 0] = []
    } = {}
}) => {
    let $ = {}
    let isValidTexture = texture && texture.constructor.name === 'Texture'

    isValidTexture && ($ = new PIXI.Sprite(texture))

    anchor && $ && $.anchor.set(aX, aY)

    position && $ && $.position.set(pX, pY)

    rotation && $ && ($.rotation = rotation)

    return {
        zeroPoint: [$.anchor.x * width, $.anchor.y * height],
        isOnStage() {
            return !!$.parent
        },
        position(x, y) {
            x = x || $.x
            y = y || $.y
            $.position.set(x, y)
            typeof this.onPositionChange === 'function' && this.onPositionChange(x, y)
        },
        $
    }
}

gameObject.id = 'GameObject'

export default gameObject
