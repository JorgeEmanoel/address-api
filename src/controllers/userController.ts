import { Request, Response } from 'express'
import Validator from '../validators/validator'
import ResponseConstants from '../constants/http/response'
import RecordedUserDTO from '../dto/recordedUserDTO'
import UserRepository, { CountProps, StoreProps, UpdateProps, FindProps, FindResult } from '../repositories/userRepository'
import AddressRepository from '../repositories/addressRepository'
import IRepository from '../contracts/iRepository'
import Hasher from '../security/hasher'
import UserDTO from '../dto/userDto'
import IHash from '../contracts/iHash'
import jwt from 'jsonwebtoken'
import AuthConfig from '../config/auth'

interface StoreBodyProps extends Request {
  body: {
    name: string
    email: string
    password: string
  }
}

interface UpdateBodyProps extends Request {
  body: {
    name?: string
    email?: string
    password?: string
  }
}

interface LoginBodyProps extends Request {
  body: {
    email: string
    password: string
  }
}

interface AuthenticatedRequest extends Request {
  user: RecordedUserDTO
}

class UserController {
  private _validator: Validator
  private _hasher: IHash
  private _repo: IRepository<
    UserDTO,
    CountProps,
    StoreProps,
    UpdateProps,
    FindProps,
    FindResult
  >

  constructor (validator: Validator, hasher: IHash | null = null) {
    this._validator = validator
    if (!hasher) {
      hasher = new Hasher()
    }
    this._hasher = hasher
    this._repo = new UserRepository(hasher)
  }

  async show (req: Request, res: Response) {
    const addressRepo = new AddressRepository()
    const addresses = await addressRepo.all({
      userId: (<Request & { user: UserDTO}>req).user.id
    })

    return res.status(200).send({
      user: (<Request & { user: UserDTO}>req).user,
      addresses
    })
  }

  async auth (req: LoginBodyProps, res: Response) {
    const fails = this._validator.withData(req.body).withRules([
      {
        fieldName: 'email',
        rules: ['required']
      },
      {
        fieldName: 'password',
        rules: ['required']
      }
    ]).fails()

    if (fails) {
      return res.status(ResponseConstants.HTTP_BAD_REQUEST).send({
        message: 'Invalid data',
        errors: this._validator.errors()
      })
    }

    const { email, password } = req.body

    const data = await this._repo.find({ email })

    if (!data) {
      return res.status(ResponseConstants.HTTP_FORBIDDEN).send({
        message: 'Invalid e-mail or password'
      })
    }

    if (data.password !== this._hasher.make(password)) {
      return res.status(ResponseConstants.HTTP_FORBIDDEN).send({
        message: 'Invalid e-mail or password'
      })
    }

    const token = jwt.sign({
      id: data.user.id
    }, AuthConfig.jwt.secret, {
      expiresIn: AuthConfig.jwt.timeout
    })

    res.status(ResponseConstants.HTTP_OK).send({
      token
    })
  }

  async store (req: StoreBodyProps, res: Response) {
    const fails = this._validator.withData(req.body).withRules([
      {
        fieldName: 'name',
        rules: ['required', 'min:3', 'max:200']
      },
      {
        fieldName: 'email',
        rules: ['required', 'min:5', 'max:200']
      },
      {
        fieldName: 'password',
        rules: ['required', 'min:8', 'max:200']
      }
    ]).fails()

    if (fails) {
      return res.status(ResponseConstants.HTTP_BAD_REQUEST).send({
        message: 'Invalid data',
        errors: this._validator.errors()
      })
    }

    const { name, email, password } = req.body

    const accountWithTheSameEmail = await this._repo.count({ email })

    if (accountWithTheSameEmail) {
      return res.status(ResponseConstants.HTTP_UNPROCESSABLE_ENTITY).send({
        message: 'E-mail already taken'
      })
    }

    const user = await this._repo.store({
      name,
      email,
      password
    })

    res.status(ResponseConstants.HTTP_CREATED).json(user)
  }

  async update (req: UpdateBodyProps, res: Response) {
    const fails = this._validator.withData(req.body).withRules([
      {
        fieldName: 'name',
        rules: ['min:3', 'max:200']
      },
      {
        fieldName: 'email',
        rules: ['min:5', 'max:200']
      },
      {
        fieldName: 'password',
        rules: ['min:8', 'max:200']
      }
    ]).fails()

    if (fails) {
      return res.status(ResponseConstants.HTTP_BAD_REQUEST).send({
        message: 'Invalid data',
        errors: this._validator.errors()
      })
    }

    const { email } = (<AuthenticatedRequest>req).user

    if (req.body.email && email !== req.body.email) {
      const accountWithTheSameEmail = await this._repo.count({ email: req.body.email })

      if (accountWithTheSameEmail) {
        return res.status(ResponseConstants.HTTP_UNPROCESSABLE_ENTITY).send({
          message: 'E-mail already taken'
        })
      }
    }

    const user = await this._repo.update(
      (<AuthenticatedRequest>req).user.id,
      (<AuthenticatedRequest>req).body
    )

    if (!user) {
      return res.status(ResponseConstants.HTTP_UNPROCESSABLE_ENTITY).send({
        message: 'It was not possible to update your data'
      })
    }

    res.status(ResponseConstants.HTTP_OK).send(user)
  }

  async delete (req: Request, res: Response) {
    const user = (<AuthenticatedRequest>req).user
    const addressRepo = new AddressRepository()

    const addresses = await addressRepo.all({
      userId: user.id
    })

    addresses?.forEach(async address => {
      await addressRepo.delete(Number(address.id))
    })

    this._repo.delete(Number(user.id))
    res.status(ResponseConstants.HTTP_OK).send(user)
  }
}

export default UserController
