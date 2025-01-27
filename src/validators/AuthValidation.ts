import {body} from "express-validator";

export const registerValidation = [
    body('fullName', 'Full name is required').isLength({min: 3}).isString(),
    body('email', 'Email is required').isEmail(),
    body('password', 'Password is required').isLength({min: 6}),
    body('imageUrl', 'Avatar url is optional and should be url').optional().isURL().isString(),
]

export const loginValidation = [
    body('email', 'Email is required').isEmail(),
    body('password', 'Password is required').isLength({min: 6}),
]
