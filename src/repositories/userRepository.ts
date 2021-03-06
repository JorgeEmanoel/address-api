import IHash from '../contracts/iHash'
import UserDTO from '../dto/userDto'
import IRepository from '../contracts/iRepository'
import User from '../models/user'

interface CountProps {
  name?: string
  email?: string
  id?: number
}

interface FindProps {
  name?: string
  email?: string
  id?: number
}

interface StoreProps {
  name: string
  email: string
  password: string
}

interface FindResult {
  user: UserDTO,
  password: string
}

interface UpdateProps {
  name?: string
  email?: string
  password?: string
}

class UserRepository implements IRepository<
  UserDTO,
  CountProps,
  StoreProps,
  UpdateProps,
  FindProps,
  FindResult
> {
  private _hasher: IHash

  constructor (hasher: IHash) {
    this._hasher = hasher
  }

  async count (attributes: CountProps) {
    const where: {
      name?: string
      email?: string
    } = {}

    if (attributes.name) {
      where.name = attributes.name
    }

    if (attributes.email) {
      where.email = attributes.email
    }

    const result = await User.findAndCountAll({
      where
    })

    return result.count
  }

  async find (attributes: FindProps): Promise<FindResult | null> {
    const where: {
      name?: string
      email?: string
      id?: number
    } = {}

    if (attributes.name) {
      where.name = attributes.name
    }

    if (attributes.email) {
      where.email = attributes.email
    }

    if (attributes.id) {
      where.id = attributes.id
    }

    const result = await User.findOne({
      where
    })

    if (!result) {
      return null
    }

    return {
      user: new UserDTO(result.name, result.email, result.id),
      password: result.password
    }
  }

  async all (attributes: FindProps): Promise<UserDTO[] | null> {
    const where: {
      name?: string
      email?: string
      id?: number
    } = {}

    if (attributes.name) {
      where.name = attributes.name
    }

    if (attributes.email) {
      where.email = attributes.email
    }

    if (attributes.id) {
      where.id = attributes.id
    }

    const users = await User.findAll({
      where
    })

    if (!users) {
      return null
    }

    return users.map(function (user) {
      return new UserDTO(user.name, user.email, user.id)
    })
  }

  async store (data: StoreProps) {
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: this._hasher.make(data.password)
    })

    if (!user) {
      throw new Error('It was not possible to insert user in database')
    }

    return new UserDTO(user.name, user.email, user.id)
  }

  async update (id: number, data: UpdateProps): Promise<UserDTO | null> {
    const user = await User.findByPk(id)

    if (!user) {
      return null
    }

    if (data.password) {
      data.password = this._hasher.make(data.password)
    }

    const updatedUser = await user.update(data)
    return new UserDTO(updatedUser.name, updatedUser.email, updatedUser.id)
  }

  async delete (id: number): Promise<UserDTO | null> {
    const user = await User.findByPk(id)

    if (!user) {
      return null
    }

    await user.destroy()

    return new UserDTO(user.name, user.email, user.id)
  }
}

export { CountProps, StoreProps, UpdateProps, FindProps, FindResult }

export default UserRepository
