import { GlowFilter } from 'pixi-filters'

export const glowFilter = ({
    distance = 10,
    outerStrength = 4,
    innerStrength = 1,
    color = 'ffffff',
    quality = 0.5
}) => new GlowFilter(distance, outerStrength, innerStrength, parseInt(`0x${color}`, 16), quality)
