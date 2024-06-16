import { Router } from 'express'
import { body, param } from 'express-validator'
import { AuthController } from '../controllers/AuthController'
import { handleInputError } from '../middleware/validation'
import { authenticate } from '../middleware/auth'

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El Nombre es obligatorio'),
    body('email')
        .isEmail().withMessage('Email no válido'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe contener al menos 6 caracteres'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true
        }),

    handleInputError,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El Token es obligatorio'),
    handleInputError,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('Email no válido'),
    body('password')
        .notEmpty().withMessage('La contraseña no puede estar vacía'),
    handleInputError,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputError,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputError,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El Token es obligatorio'),
    handleInputError,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token no válido'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe contener al menos 6 caracteres'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true
        }),
    handleInputError,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

// Profile

router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage('El Nombre es obligatorio'),
    body('email')
        .isEmail().withMessage('Email no válido'),
    handleInputError,
    AuthController.updateProfile
)

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('La contraseña actual es obligatoria'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe contener al menos 6 caracteres'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden')
            }
            return true
        }),
    handleInputError,
    AuthController.updateCurrentPassword
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputError,
    AuthController.checkPassword
)

export default router 