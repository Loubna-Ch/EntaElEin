import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const userValidators = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isLength({ max: 50 })
        .withMessage('Username cannot exceed 50 characters'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required')
        .isLength({ max: 100 })
        .withMessage('Email cannot exceed 100 characters'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('phonenumber')
        .optional({ checkFalsy: true })
        .isMobilePhone('any')
        .withMessage('A valid phone number is required'),

    body('address')
        .optional({ checkFalsy: true })
        .trim(),

    body('dateofbirth')
        .optional({ checkFalsy: true })
        .isISO8601()
        .withMessage('Date of birth must be a valid date (YYYY-MM-DD)'),

    body('regionid')
        .optional({ checkFalsy: true })
        .isInt()
        .withMessage('Region ID must be an integer'),

    body('role')
        .trim()
        .notEmpty()
        .withMessage('Role name is required')
        .isLength({ max: 100 })
        .withMessage('Role name is too long'),


    validate,
];