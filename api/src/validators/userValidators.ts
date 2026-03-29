import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const userRules = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('phonenumber')
        .optional({ checkFalsy: true })
        .isMobilePhone('any')
        .withMessage('A valid phone number is required'),

    body('role')
        .optional()
        .isIn(['citizen', 'officer', 'admin'])
        .withMessage('Invalid role assigned'),

    // Following your Dr.'s style: the validate middleware is the last item in the array
    validate,
];