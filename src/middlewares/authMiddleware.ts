import { NextFunction, Request, Response } from 'express'
import UserDTO from '../dto/userDto'
import Hasher from '../security/hasher'
import UserRepository from '../repositories/userRepository'
import ResponseConstants from '../constants/http/response'
import jwt from 'jsonwebtoken'
import AuthConfig from '../config/auth'

const userRepository = new UserRepository(new Hasher())

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.get('Authorization')

  if (!token) {
    return res.status(ResponseConstants.HTTP_UNAUTHORIZED).send({})
  }

  let payload

  try {
    payload = jwt.verify(token, AuthConfig.jwt.secret)
  } catch (e) {
    return res.status(ResponseConstants.HTTP_UNAUTHORIZED).send({})
  }

  const data = await userRepository.find({ id: (<{ id: number }>payload).id })

  if (!data) {
    return res.status(ResponseConstants.HTTP_UNAUTHORIZED).send({})
  }

  (<Request & { user: UserDTO }>req).user = data.user
  next()
}

export default authMiddleware
