import { Request, Response } from 'express'
import Validator from '../validators/validator'
import ResponseConstants from '../constants/http/response'
import RecordedUserDTO from '../dto/recordedUserDTO'
import AddressRepository, { CountProps, StoreProps, UpdateProps, FindProps } from '../repositories/addressRepository'
import IRepository from '../contracts/iRepository'
import AddressDTO from '../dto/addressDto'
import UserDTO from '../dto/userDto'

interface StoreBodyProps extends Request {
  body: {
    neightborhood: string
    city: string;
    state: string;
    postalCode: string;
  }
}

interface UpdateBodyProps extends Request {
  params: {
    id: string
  },
  body: {
    neightborhood?: string
    city?: string;
    state?: string;
    postalCode?: string;
  }
}

interface DeleteProps extends Request {
  params: {
    id: string
  },
}

interface ShowProps extends Request {
  params: {
    id: string
  },
}

interface FilteredRequest extends Request {
  query: {
    neightborhood?: string
    city?: string
    state?: string
    postalCode?: string
  },
}

interface AuthenticatedRequest extends Request {
  user: RecordedUserDTO
}

class AddressController {
  private _validator: Validator
  private _repo: IRepository<
    AddressDTO,
    CountProps,
    StoreProps,
    UpdateProps,
    FindProps,
    AddressDTO
  >

  constructor (validator: Validator) {
    this._validator = validator
    this._repo = new AddressRepository()
  }

  async index (req: Request, res: Response) {
    const filters: {
      userId: number
      neightborhood?: string
      city?: string
      state?: string
      postalCode?: string
    } = {
      userId: Number((<Request & { user: UserDTO}>req).user.id)
    }

    const { query } = <FilteredRequest>req

    if (query.city) {
      filters.city = query.city
    }

    if (query.neightborhood) {
      filters.neightborhood = query.neightborhood
    }

    if (query.state) {
      filters.state = query.state
    }

    if (query.postalCode) {
      filters.postalCode = query.postalCode
    }

    const addresses = await this._repo.all(filters)

    return res.status(200).send({
      addresses
    })
  }

  async show (req: ShowProps, res: Response) {
    const address = await this._repo.find({
      id: Number(req.params.id),
      userId: (<ShowProps & AuthenticatedRequest>req).user.id
    })

    if (!address) {
      return res.status(ResponseConstants.HTTP_NOT_FOUND).send({
        message: 'Address not found'
      })
    }

    res.status(ResponseConstants.HTTP_OK).send(address)
  }

  async store (req: StoreBodyProps, res: Response) {
    const fails = this._validator.withData(req.body).withRules([
      {
        fieldName: 'neightborhood',
        rules: ['required', 'min:3', 'max:200']
      },
      {
        fieldName: 'city',
        rules: ['required', 'min:3', 'max:200']
      },
      {
        fieldName: 'state',
        rules: ['required', 'min:2', 'max:2']
      },
      {
        fieldName: 'postalCode',
        rules: ['required', 'min:8', 'max:8']
      }
    ]).fails()

    if (fails) {
      return res.status(ResponseConstants.HTTP_BAD_REQUEST).send({
        message: 'Invalid data',
        errors: this._validator.errors()
      })
    }

    const {
      neightborhood,
      city,
      state,
      postalCode
    } = req.body

    const address = await this._repo.store({
      neightborhood,
      city,
      state: state.toUpperCase(),
      postalCode,
      userId: (<AuthenticatedRequest>req).user.id
    })

    res.status(ResponseConstants.HTTP_CREATED).json(address)
  }

  async update (req: UpdateBodyProps, res: Response) {
    const fails = this._validator.withData(req.body).withRules([
      {
        fieldName: 'neightborhood',
        rules: ['min:3', 'max:200']
      },
      {
        fieldName: 'city',
        rules: ['min:3', 'max:200']
      },
      {
        fieldName: 'state',
        rules: ['min:2', 'max:2']
      },
      {
        fieldName: 'postalCode',
        rules: ['min:8', 'max:8']
      }
    ]).fails()

    if (fails) {
      return res.status(ResponseConstants.HTTP_BAD_REQUEST).send({
        message: 'Invalid data',
        errors: this._validator.errors()
      })
    }

    if (!await this._repo.find({
      id: Number(req.params.id),
      userId: (<UpdateBodyProps & AuthenticatedRequest>req).user.id
    })) {
      return res.status(ResponseConstants.HTTP_NOT_FOUND).send({
        message: 'Address not found'
      })
    }

    const address = await this._repo.update(
      Number(req.params.id),
      req.body
    )

    if (!address) {
      return res.status(ResponseConstants.HTTP_UNPROCESSABLE_ENTITY).send({
        message: 'It was not possible to update your data'
      })
    }

    res.status(ResponseConstants.HTTP_OK).send(address)
  }

  async delete (req: DeleteProps, res: Response) {
    const address = await this._repo.find({
      id: Number(req.params.id),
      userId: (<DeleteProps & AuthenticatedRequest>req).user.id
    })

    if (!address) {
      return res.status(ResponseConstants.HTTP_NOT_FOUND).send({
        message: 'Address not found'
      })
    }

    const data = await this._repo.delete(Number(req.params.id))

    res.status(ResponseConstants.HTTP_OK).send(data)
  }
}

export default AddressController
