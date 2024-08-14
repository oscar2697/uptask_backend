import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage("What's your name?"),
    body('password')
        .isLength({ min: 8 }).withMessage('Enter a combination of at least 8 letters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The Passwords does not match')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('Please enter a valid email address'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage("Please enter your token"),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('Please enter a valid email address'),
    body('password')
        .notEmpty().withMessage('Password is Required'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('Email not valid'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email not valid'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty().withMessage("Please enter your token"),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('Token not valid'),
    body('password')
        .isLength({ min: 8 }).withMessage('Enter a combination of at least 8 letters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The Passwords does not match')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePassword
)

router.get('/user',
    authenticate,
    AuthController.user
)

//Profile
router.put('/profile',
    authenticate,
    body('name')
        .notEmpty().withMessage("What's your name?"),
    body('email')
        .isEmail().withMessage('Please enter a valid email address'),
    handleInputErrors,
    AuthController.updateProfile
)

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage("What's your password?"),
    body('password')
        .isLength({ min: 8 }).withMessage('Enter a combination of at least 8 letters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The Passwords does not match')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

export default router