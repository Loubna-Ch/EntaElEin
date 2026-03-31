import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const regionValidators = [

    body('regionname')
        .trim()
        .notEmpty()
        .withMessage('Region name is required'),

    validate,
];