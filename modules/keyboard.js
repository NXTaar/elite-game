const codes = {
    87: 'w',
    65: 'a',
    83: 's',
    68: 'd',
    81: 'q',
    69: 'e',
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
}

class KeyboardWatcher {
    pressedKeys = {}

    constructor() {
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
    }

    onKeyDown = ({ keyCode }) => {
        let key = codes[keyCode]

        key && !this.pressedKeys[key] && (this.pressedKeys[key] = true)
    }

    onKeyUp = ({ keyCode }) => {
        let key = codes[keyCode]


        key && this.pressedKeys[key] && delete this.pressedKeys[key]
    }
}

export default new KeyboardWatcher()
