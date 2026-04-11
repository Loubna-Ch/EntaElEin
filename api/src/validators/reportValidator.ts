import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const reportValidators = [
    body('crimedate')
        .trim()
        .notEmpty()
        .withMessage('Crime date is required')
        .isISO8601()
        .withMessage('Crime date must be a valid date (YYYY-MM-DD)'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 }) 
        .withMessage('Description is too long'),

    body('status')
        .trim()
        .notEmpty()
        .withMessage('Status is required')
        .isLength({ max: 1000 }) 
        .withMessage('Status is too long'),
        // .isIn(['Pending', 'In Progress', 'Resolved'])

    body('image_url')
        .optional({ checkFalsy: true })
        .isString() 
        .withMessage('Image URL must be a valid string'),

    body('userid')
        .optional({ checkFalsy: true })
        .isInt()
        .withMessage('User ID must be an integer'),

    body('regionid')
        .optional({ checkFalsy: true })
        .isInt()
        .withMessage('Region ID must be an integer'),

    body('hadasid')
        .optional({ checkFalsy: true })
        .isInt()
        .withMessage('Hadas ID must be an integer'),

    validate,
];