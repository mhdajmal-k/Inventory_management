import Joi from "joi";

export const CustomerValidatorSchema = Joi.object({
    _id: Joi.string().optional(),
    name: Joi.string().trim().required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "any.required": "Name is required",
        "string.trim": "Name must not have leading or trailing spaces",
    }),
    address: Joi.string().trim().required().messages({
        "string.base": "Address must be a string",
        "string.empty": "Address is required",
        "any.required": "Address is required",
        "string.trim": "Address must not have leading or trailing spaces",
    }),
    mobile: Joi.string()
        .pattern(/^\d{10}$/)
        .required()
        .messages({
            "string.base": "Mobile number must be a string",
            "string.empty": "Mobile number is required",
            "string.pattern.base": "Mobile number must be exactly 10 digits",
            "any.required": "Mobile number is required",
        }),
    email: Joi.string().trim().email().required().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email is required",
        "string.trim": "Email must not have leading or trailing spaces",
    }),
    gender: Joi.string()
        .required()
        .messages({
            "string.base": "Gender must be an string",
            "string.min": "At least one gender must be selected",
            "any.required": "Gender is required",
        }),
});
