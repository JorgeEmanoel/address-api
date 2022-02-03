import { Sequelize } from 'sequelize'
import IDatabaseConnection from '../contracts/iDatabaseConnection'
import { database } from '../config'

class SequelizeDB implements IDatabaseConnection {
  instance: Sequelize

  constructor () {
    console.log('Constructor called')

    this.instance = new Sequelize(database.name, database.username, database.password, {
      host: database.host,
      dialect: 'mysql'
    })
  }

  disconnect () {
    this.instance?.close()
  }

  async test () {
    try {
      await this.instance?.authenticate()
      return true
    } catch (err) {
      return false
    }
  }
}

const sequelizeDb = new SequelizeDB()
Object.freeze(sequelizeDb)

export default sequelizeDb
