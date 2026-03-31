import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const involvedInValidators = [
    body('participantid')
        .notEmpty()
        .withMessage('Participant ID is required')
        .isInt()
        .withMessage('Participant ID must be an integer'),

    body('reportid')
        .notEmpty()
        .withMessage('Report ID is required')
        .isInt()
        .withMessage('Report ID must be an integer'),

    validate,
];