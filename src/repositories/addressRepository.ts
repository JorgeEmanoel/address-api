import IRepository from '../contracts/iRepository'
import Address from '../models/address'
import AddressDTO from '../dto/addressDto'

interface CountProps {
  userId?: number
}

interface FindProps {
  id?: number
  userId?: number
}

interface StoreProps {
  neightborhood: string
  city: string;
  state: string;
  postalCode: string;
  userId: number
}

interface UpdateProps {
  neightborhood?: string
  city?: string;
  state?: string;
  postalCode?: string;
}

class AddressRepository implements IRepository<
  AddressDTO,
  CountProps,
  StoreProps,
  UpdateProps,
  FindProps,
  AddressDTO
> {
  async count (attributes: CountProps): Promise<number> {
    const where: {
      userId?: number
    } = {}

    if (attributes.userId) {
      where.userId = attributes.userId
    }

    const result = await Address.findAndCountAll({
      where
    })

    return result.count
  }

  async find (attributes: FindProps): Promise<AddressDTO | null> {
    const where: {
      id?: number
      userId?: number
    } = {}

    if (attributes.id) {
      where.id = attributes.id
    }

    if (attributes.userId) {
      where.userId = attributes.userId
    }

    const result = await Address.findOne({
      where
    })

    if (!result) {
      return null
    }

    return new AddressDTO(
      result.neightborhood,
      result.city,
      result.state,
      result.postalCode,
      result.id
    )
  }

  async all (attributes: FindProps): Promise<AddressDTO[] | null> {
    const where: {
      id?: number
      userId?: number
    } = {}

    if (attributes.id) {
      where.id = attributes.id
    }

    if (attributes.userId) {
      where.userId = attributes.userId
    }

    const addresses = await Address.findAll({
      where
    })

    if (!addresses) {
      return null
    }

    return addresses.map(function (result) {
      return new AddressDTO(
        result.neightborhood,
        result.city,
        result.state,
        result.postalCode,
        result.id
      )
    })
  }

  async store (data: StoreProps) {
    const address = await Address.create({
      neightborhood: data.neightborhood,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      userId: data.userId
    })

    if (!address) {
      throw new Error('It was not possible to insert user in database')
    }

    return new AddressDTO(
      address.neightborhood,
      address.city,
      address.state,
      address.postalCode,
      address.id
    )
  }

  async update (id: number, data: UpdateProps): Promise<AddressDTO | null> {
    const address = await Address.findByPk(id)

    if (!address) {
      return null
    }

    const updatedAddress = await address.update(data)

    return new AddressDTO(
      updatedAddress.neightborhood,
      updatedAddress.city,
      updatedAddress.state,
      updatedAddress.postalCode,
      updatedAddress.id
    )
  }

  async delete (id: number): Promise<AddressDTO | null> {
    const address = await Address.findByPk(id)

    if (!address) {
      return null
    }

    await address.destroy()

    return new AddressDTO(
      address.neightborhood,
      address.city,
      address.state,
      address.postalCode
    )
  }
}

export { CountProps, StoreProps, UpdateProps, FindProps }

export default AddressRepository
