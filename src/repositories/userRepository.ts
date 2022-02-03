import IRepository from '../contracts/iRepository'
import UserDTO from '../dto/userDto'
import User from '../models/user'

interface CountProps {
  name?: string
  email?: string
  id?: number
}

interface StoreProps {
  name: string
  email: string
  password: string
}

function hash (str: string) {
  return str
}

class UserRepository implements IRepository<UserDTO, StoreProps> {
  async count (attributes: CountProps) {
    const result = await User.findAndCountAll({
      where: {
        name: attributes.name,
        email: attributes.email,
        id: attributes.id
      }
    })

    return result.count
  }

  async store (data: StoreProps) {
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hash(data.password)
    })

    if (!user) {
      throw new Error('It was not possible to insert user in database')
    }

    return new UserDTO(user.name, user.email, user.id)
  }
}

export {
  StoreProps
}

export default new UserRepository()
