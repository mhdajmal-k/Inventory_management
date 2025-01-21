import Joi from "joi";

export const signUpValidatorSchema = Joi.object({
    companyName: Joi.string().trim().min(3).max(20).required().messages({
        "string.base": "Username must be a string",
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters long",
        "string.max": "Username cannot exceed 30 characters",
        "string.trim": "Username must not have leading or trailing spaces",
    }),
    email: Joi.string().trim().email().required().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email is required",
        "string.trim": "Email must not have leading or trailing spaces",
    }),
    password: Joi.string().trim().min(6).max(128).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "string.max": "Password cannot exceed 128 characters",
        "string.empty": "Password is required",
        "string.trim": "Password must not have leading or trailing spaces",
    }),
});
