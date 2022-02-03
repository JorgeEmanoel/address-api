import app from './app'
import config from './config'

app.listen(config.application.port, () => {
  console.log(`Listening on port ${config.application.port}`)
})
