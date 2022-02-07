import dotenv from 'dotenv-safe'
dotenv.config()

interface IDatabaseConfig {
  host: string
  port: string
  username: string
  password: string
  name: string
}

interface ISecurityConfig {
  jwt: {
    secret: string,
    timeout: number | string
  }
}

interface IApplicationConfig {
  port: string
}

const auth: ISecurityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'address-api',
    timeout: process.env.JWT_TIMEOUT || 300
  }
}

const database: IDatabaseConfig = {
  host: String(process.env.DB_HOST || '127.0.0.1'),
  port: String(process.env.DB_PORT || '3306'),
  username: String(process.env.DB_USERNAME || 'root'),
  password: String(process.env.DB_PASSWORD || '123456'),
  name: String(process.env.DB_NAME || 'address_db')
}

const application: IApplicationConfig = {
  port: process.env.APP_PORT || '3000'
}

export {
  IDatabaseConfig,
  IApplicationConfig,
  database,
  application,
  auth
}
