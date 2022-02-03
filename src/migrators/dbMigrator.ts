import IMigrator from '../contracts/iMigrator'
import User from '../models/user'

class DbMigrator implements IMigrator {
  async migrate (callback: () => void) {
    await User.sync()
    callback()
  }
}

export default DbMigrator
