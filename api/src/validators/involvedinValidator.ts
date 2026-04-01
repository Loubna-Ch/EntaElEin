import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const involvedInValidators = [
    body('participantid')
        .notEmpty()
        .withMessage('Participant ID is required')
        .isInt({ min: 1 })
        .withMessage('Participant ID must be a positive integer'),

    body('reportid')
        .notEmpty()
        .withMessage('Report ID is required')
        .isInt({ min: 1 })
        .withMessage('Report ID must be a positive integer'),

    validate,
];