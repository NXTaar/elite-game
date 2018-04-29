const gameObject = (setup, build) => {
    let {
        texture,
        position,
        rotation,
        animation = false,
        position: [pX = 0, pY = 0] = [],
        ...props
    } = setup

    build = build || {}
    let {
        config: {
            anchor,
            width,
            height,
            anchor: [aX = 0, aY = 0] = []
        } = {}
    } = build

    let $ = {}

    checkTextureIsValid(setup) && (texture = setup)

    let isValidTexture = Array.isArray(texture) ? texture.every(checkTextureIsValid) : checkTextureIsValid(texture)

    isValidTexture && ($ = animation ? new PIXI.extras.AnimatedSprite(texture) : new PIXI.Sprite(texture))

    animation && Object.assign($, animation)

    anchor && $ && $.anchor.set(aX, aY)

    position && $ && $.position.set(pX, pY)

    rotation && $ && ($.rotation = rotation)

    Object.assign($, props)

    return {
        $,
        ...compileMethods({ anchor, width, height, animation, $ })
    }
}

gameObject.id = 'GameObject'

const checkTextureIsValid = texture => texture && texture instanceof PIXI.Texture

const compileMethods = ({ anchor, width, height, animation, $ }) => ({
    ...anchor && { zeroPoint: [$.anchor.x * width, $.anchor.y * height] },

    ...animation && {
        play() {
            this.$.play()
        }
    },
    isOnStage() {
        return !!this.$.parent
    },
    move(x, y) {
        x = x || this.$.x
        y = y || this.$.y
        this.$.position.set(x, y)
        typeof this.onPositionChange === 'function' && this.onPositionChange(x, y)
    }
})

export default gameObject
