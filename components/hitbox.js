import { prepareCollisions } from '@modules/collision'

const Hitbox = (params, { x, y, zeroPoint, config: { hitbox = [] } = {} }) => ({
    hitboxes: prepareCollisions({ hitbox, zeroPoint, x, y })
})

Hitbox.id = 'Hitbox'

export default Hitbox
