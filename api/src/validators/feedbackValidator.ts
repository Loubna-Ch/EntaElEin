import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const feedbackValidators = [
    body('content')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 }) 
        .withMessage('Feedback message is too long (max 1000 characters)'),

    body('rating')
        .notEmpty()
        .withMessage('Rating is required')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be a number between 1 and 5'),

    body('userid')
        .notEmpty()
        .withMessage('User ID is required')
        .isInt()
        .withMessage('User ID must be a valid integer'),

    validate,
];