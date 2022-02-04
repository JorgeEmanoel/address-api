interface IApplicationConfig {
  jwt: {
    secret: string,
    timeout: number | string
  }
}

const auth: IApplicationConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'address-api',
    timeout: process.env.JWT_TIMEOUT || 300
  }
}

export default auth
