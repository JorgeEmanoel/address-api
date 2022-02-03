interface IDatabaseConfig {
  host: string
  port: string
  username: string
  password: string
  name: string
}

const databaseConfig: IDatabaseConfig = {
  host: String(process.env.DB_HOST || '127.0.0.1'),
  port: String(process.env.DB_PORT || '3306'),
  username: String(process.env.DB_USERNAME || 'root'),
  password: String(process.env.DB_PASSWORD || '123456'),
  name: String(process.env.DB_NAME || 'address_db')
}

export { IDatabaseConfig }

export default databaseConfig
