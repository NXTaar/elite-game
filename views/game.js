import View from '@modules/view'
import HUD from './hud'
import World from './world'

class Game extends View {
    static stage = 'game'

    prepare() {
        return [
            {
                node: new World()
            },
            {
                node: new HUD()
            }
        ]
    }
}

export default Game
