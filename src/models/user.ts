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
    type: DataTypes.STRING(200),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(200),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(254),
    allowNull: false
  }
}, {
  sequelize: database.instance,
  modelName: 'User',
  tableName: 'users'
})

User.hasMany(Address, { foreignKey: 'userId' })

export default User
