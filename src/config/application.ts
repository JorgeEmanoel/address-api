interface IApplicationConfig {
  port: string
}

const application: IApplicationConfig = {
  port: process.env.APP_PORT || '3000'
}

export default application
