import bootstrap from './app'
import * as config from './config'
import SequelizeDB from './databases/sequelizeDb'

(async () => {
  const { app } = await bootstrap([SequelizeDB])

  app.listen(config.application.port, () => {
    console.log(`Listening on port ${config.application.port}`)
  })
})()
