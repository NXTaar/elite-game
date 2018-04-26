const Projectile = ({
    direction = -1,
    target,
    speed = 0,
    height = 0,
    onOutOfSight,
    onHit
}, object) => {
    object.loopActions = object.loopActions || []
    Object.assign(object, { direction, speed, target })

    object.loopActions.push({
        id: 'projectileMovement',
        action: onTick({ height, onOutOfSight, onHit })
    })
}

Projectile.id = 'Projectile'

const onTick = ({ height, onOutOfSight, onHit }) => bullet => {
    bullet.$.y = bullet.$.y + bullet.speed * bullet.direction

    let hit = typeof onHit === 'function' && checkHit(bullet, bullet.target)

    hit && onHit(hit, bullet)

    typeof onOutOfSight === 'function' && !checkInSight(bullet, height) && onOutOfSight(bullet)
}

const checkHit = (
    {
        hitboxes: projectileCollisions,
        $: { x: projectileX, y: projectileY },
        id: projectileId
    },
    {
        hitboxes: targetHitboxes = [],
        $: { x: targetX, y: targetY },
        id: targetId
    }
) => {
    let projectile = projectileCollisions[0]

    projectile.updatePosition(projectileX, projectileY)

    let hit = targetHitboxes.find(hitbox => {
        hitbox.updatePosition(targetX, targetY)

        return projectile.collision(hitbox)
    })

    if (!hit) return null

    let { zone, side } = hit

    return {
        projectileId,
        targetId,
        zone,
        ...side && { side }
    }
}

const checkInSight = ({ $, speed, direction }, height) => {
    $.y = $.y + speed * direction

    let yCheck = $.y + $.height * -0.5 * direction

    return yCheck >= 0 && yCheck <= height
}

export default Projectile
