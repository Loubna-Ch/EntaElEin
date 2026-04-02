import { body } from 'express-validator';
import validate from '../middlewares/validate';
import { INCIDENT_TYPES } from '../hadastypes';

export const hadasValidators = [
    body('hadasdescription')
        .trim()
        .notEmpty()
        .withMessage('Hadas description is required')
        .isIn(INCIDENT_TYPES)
        .withMessage('Invalid incident type selected. Please choose a valid category from the list.'),

    validate,
];