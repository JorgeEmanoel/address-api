import { Router } from 'express'
import Hasher from '../security/hasher'
import UserController from '../controllers/userController'
import AddressController from '../controllers/addressController'
import Validator from '../validators/validator'
import authMiddleware from '../middlewares/authMiddleware'

const userController = new UserController(new Validator(), new Hasher())
const addressController = new AddressController(new Validator())

const router = Router()

router.post('/auth/register', userController.store.bind(userController))
router.post('/auth/login', userController.auth.bind(userController))
router.get('/auth/data', authMiddleware, userController.show.bind(userController))
router.put('/auth/data', authMiddleware, userController.update.bind(userController))
router.delete('/auth/data', authMiddleware, userController.delete.bind(userController))

router.get('/addresses', authMiddleware, addressController.index.bind(addressController))
router.post('/addresses', authMiddleware, addressController.store.bind(addressController))
router.get('/addresses/:id', authMiddleware, addressController.show.bind(addressController))
router.put('/addresses/:id', authMiddleware, addressController.update.bind(addressController))
router.delete('/addresses/:id', authMiddleware, addressController.delete.bind(addressController))

export default router
