import { Request, Response } from 'express'
import response from '../constants/http/response'
import IController from '../contracts/iController'
import repo from '../repositories/userRepository'

interface StoreBodyProps extends Request {
  body: {
    name: string
    email: string
    password: string
  }
}

class UserController implements IController {
  public index (req: Request, res: Response): Response {
    return res.send()
  }

  public async store (req: StoreBodyProps, res: Response) {
    const { name, email, password } = req.body
    const user = await repo.store({
      name,
      email,
      password
    })

    res.status(response.HTTP_CREATED).json(user)
  }

  public update (req: Request, res: Response): Response {
    return res.send()
  }

  public delete (req: Request, res: Response): Response {
    return res.send()
  }
}

export default new UserController()
