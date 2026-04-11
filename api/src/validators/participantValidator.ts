import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const participantValidators = [
    body('participantname')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage('Name is too long'),

    body('participanttype')
        .notEmpty()
        .withMessage('Participant type is required')
        .isIn(['Person', 'Object', 'Natural_Event', 'Crime_Entity', 'Other'])
        .withMessage('Invalid participant type selected'),

    body('description')
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage('Description is required'),

    body('pdateofbirth')
        .optional({ checkFalsy: true })
        .isISO8601()
        .notEmpty()
        .withMessage('Invalid date format'),

    body('gender')
        .optional({ checkFalsy: true })
        .isIn(['Male', 'Female'])
        .notEmpty()
        .withMessage('Invalid gender assigned'),

    validate,
];