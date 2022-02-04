import { Router } from 'express'
import Hasher from '../security/hasher'
import UserController from '../controllers/userController'
import Validator from '../validators/validator'
import authMiddleware from '../middlewares/authMiddleware'

const userController = new UserController(new Validator(), new Hasher())

const router = Router()

router.post('/auth/register', userController.store.bind(userController))
router.post('/auth/login', userController.auth.bind(userController))

router.get('/auth/data', authMiddleware, userController.show.bind(userController))
router.put('/auth/data', authMiddleware, userController.update.bind(userController))

export default router
