interface ApplicationConfig {
  port: string
}

interface Config {
  application: ApplicationConfig
}

const config: Config = {
  application: {
    port: process.env.APP_PORT || '3000'
  }
}

export default config
