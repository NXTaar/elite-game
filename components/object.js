const gameObject = ({
    texture,
    position,
    rotation,
    animation = false,
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
    let isValidTexture = Array.isArray(texture) ? texture.every(checkTextureIsValid) : checkTextureIsValid(texture)

    isValidTexture && ($ = animation ? new PIXI.extras.AnimatedSprite(texture) : new PIXI.Sprite(texture))

    animation && Object.assign($, animation)

    anchor && $ && $.anchor.set(aX, aY)

    position && $ && $.position.set(pX, pY)

    rotation && $ && ($.rotation = rotation)

    return {
        ...anchor && { zeroPoint: [$.anchor.x * width, $.anchor.y * height] },

        ...animation && {
            play() {
                this.$.play()
            }
        },
        isOnStage() {
            return !!this.$.parent
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

const checkTextureIsValid = texture => texture && texture.constructor.name === 'Texture'

export default gameObject
