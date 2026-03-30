import { body } from 'express-validator';
import validate from '../middlewares/validate';
/**
 * Validation rules for User Registration/Update.
 * Following your Dr.'s style where 'validate' is the last item in the array.
 */
export const userValidators = [
    // 1. Validate the Username
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required'),

    // 2. Validate the Email
    body('email')
        .trim()
        .isEmail()
        .withMessage('Valid email is required'),

    // 3. Validate the Password (minimum 6 characters for security)
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    // 4. Validate the Phone Number (crucial for a crime prevention app)
    body('phonenumber')
        .optional({ checkFalsy: true })
        .isMobilePhone('any')
        .withMessage('A valid phone number is required'),

    // 5. Validate the Role (only allow specific EntaElEin roles)
    body('role')
        .optional()
        .isIn(['citizen', 'officer', 'admin'])
        .withMessage('Invalid role assigned'),

    // 6. The final "gatekeeper" that checks the results of the above rules
    validate,
];