import { body } from "express-validator";
import validate from "../middlewares/validate";

export const alertedByValidators = [
    body("userid")
        .notEmpty()
        .withMessage("User ID is required")
        .isInt({})
        .withMessage("User ID must be a positive integer"),

    body("alertid")
        .notEmpty()
        .withMessage("Alert ID is required to categorize the AI alert")
        .isInt()
        .withMessage("Alert ID must be a valid integer"),
    validate,
];
