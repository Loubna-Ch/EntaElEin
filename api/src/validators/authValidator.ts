import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const registerRules = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('A valid email is required'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('phonenumber')
        .optional({ checkFalsy: true })
        .isMobilePhone('any')
        .withMessage('A valid phone number is required'),

    body('dateofbirth')
        .optional({ checkFalsy: true })
        .isDate()
        .withMessage('Date of birth must be a valid date'),

    body('role')
        .optional()
        .isIn(['admin', 'officer', 'citizen'])
        .withMessage('Role must be admin, officer, or citizen'),

    body('regionid')
        .optional({ checkFalsy: true })
        .isInt()
        .withMessage('Region ID must be a valid integer'),
    validate,
];

export const loginRules = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('A valid email is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    validate,
];