import { DataTypes, Model } from 'sequelize'
import database from '../databases/sequelizeDb'
import Address from './address'

class User extends Model {
  declare id?: number
  declare name: string
  declare email: string
  declare password: string
}

User.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: database.instance,
  modelName: 'User',
  tableName: 'users'
})

User.hasMany(Address, { foreignKey: 'userId' })

export default User
