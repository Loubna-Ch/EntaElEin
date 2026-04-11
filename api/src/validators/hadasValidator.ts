import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const hadasValidators = [
    body('hadasdescription')
        .trim()
        .notEmpty()
        .withMessage('Hadas description is required')
        .isLength({ max: 100 })
        .withMessage('Hadas description is too long'),

    validate,
];