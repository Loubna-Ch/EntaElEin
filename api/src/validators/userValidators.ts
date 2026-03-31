import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const userValidators = [

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
        .isIn(['Citizen', 'Officer', 'Admin'])
        .withMessage('Invalid role assigned'),

    validate,
];