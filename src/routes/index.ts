import { Router } from 'express'
import userController from '../controllers/userController'

const router = Router()

router.post('/auth/register', userController.store)

export default router
