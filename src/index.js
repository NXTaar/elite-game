import 'normalize.css'
import './styles.css'
import app from '@modules/app'
import state from '@modules/state'
import * as views from '../views'

state.react(() => {
    console.log(`stage changed to - ${state.currentStage}`)

    app.stage.children.forEach(view => view.dismiss())

    let View = views[state.currentStage]

    if (!View) return

    app.stage.addChild(new View())
})

app.start()
