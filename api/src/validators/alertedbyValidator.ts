import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const alertedByValidators = [
    body('userid')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer'),

    body('alertid')
        .notEmpty()
        .withMessage('Alert ID is required')
        .isInt({ min: 1 })
        .withMessage('Alert ID must be a positive integer'),

    validate,
];