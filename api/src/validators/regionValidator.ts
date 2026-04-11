import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const regionValidators = [
    body('regionname')
        .trim()
        .notEmpty()
        .isLength({ max: 100 })
        .withMessage('Region name is too long'),

    validate,
];
