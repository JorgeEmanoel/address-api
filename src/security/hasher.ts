import IHash from '../contracts/iHash'
import { createHmac } from 'crypto'

class Hasher implements IHash {
  make (value: string) {
    const hash = createHmac('sha256', process.env.HMAC_SECRET || 'hash')
      .update(value)
      .digest('hex')

    return hash
  }
}

export default Hasher
