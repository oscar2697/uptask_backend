import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage("What's your name?"),
    body('password')
        .isLength({ min: 8 }).withMessage('Enter a combination of at least 8 letters'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The Password does no match')
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

export default router