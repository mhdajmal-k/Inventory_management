import Joi from "joi";

export const ProductValidatorSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "any.required": "Name is required",
        "string.trim": "Name must not have leading or trailing spaces",
    }),
    description: Joi.string().trim().required().messages({
        "string.base": "Description must be a string",
        "string.empty": "Description is required",
        "any.required": "Description is required",
        "string.trim": "Description must not have leading or trailing spaces",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required",
    }),
    price: Joi.number().greater(0).required().messages({
        "number.base": "Price must be a number",
        "number.greater": "Price must be at least 0.01",
        "any.required": "Price is required",
    }),
    totalStockValue: Joi.number().required().messages({
        "number.base": "totalStockValue must be a number",

        "any.required": "totalStockValue is required",
    }),
});
