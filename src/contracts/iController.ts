import { Request, Response } from 'express'

interface IController {
  index: (req: Request, res: Response) => unknown
  store: (req: Request, res: Response) => unknown
  update: (req: Request, res: Response) => unknown
  delete: (req: Request, res: Response) => unknown
}

export default IController
