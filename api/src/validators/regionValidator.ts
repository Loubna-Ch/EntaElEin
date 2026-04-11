import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const regionValidators = [
    body('regionname')
        .trim()
        .notEmpty()
        .withMessage('Location name is required')
        .isLength({ max: 100 })
        .withMessage('Region name is too long'),

    validate,
];
