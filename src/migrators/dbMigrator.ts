import IMigrator from '../contracts/iMigrator'
import User from '../models/user'
import Address from '../models/address'

class DbMigrator implements IMigrator {
  async migrate (callback: () => void) {
    await User.sync()
    await Address.sync()
    callback()
  }
}

export default DbMigrator
