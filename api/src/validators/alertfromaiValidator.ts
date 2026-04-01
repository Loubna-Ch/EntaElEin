import { body } from 'express-validator';
import validate from '../middlewares/validate';

export const alertFromAiValidators = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Alert title is required')
        .isLength({ max: 255 }) 
        .withMessage('Title cannot exceed 255 characters'),

    body('message')
        .trim()
        .notEmpty()
        .withMessage('Alert message content is required'),
      
    body('hadasid')
        .notEmpty()
        .withMessage('Hadas ID is required to categorize the AI alert')
        .isInt()
        .withMessage('Hadas ID must be a valid integer'),

    validate,
];