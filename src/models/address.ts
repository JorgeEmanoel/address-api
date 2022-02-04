import { DataTypes, Model } from 'sequelize'
import database from '../databases/sequelizeDb'

class Address extends Model {
  declare id?: number
  declare neightborhood: string
  declare city: string
  declare state: string
  declare postalCode: string
  declare userId: number
}

Address.init({
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  neightborhood: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: database.instance,
  modelName: 'Address',
  tableName: 'addresses'
})

export default Address
