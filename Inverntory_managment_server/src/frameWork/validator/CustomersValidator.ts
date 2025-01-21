import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../helpers/Enums";
import { CustomerValidatorSchema } from "../helpers/validator/customersValidator";

export const validateCustomersData = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { error } = CustomerValidatorSchema.validate(req.body);
    const particularError = error?.details
        .map((detail) => detail.message.replace(/"/g, ""))
        .filter((message) => message);
    if (error) {
        res.status(HttpStatusCode.BadRequest).json({
            status: false,
            message: `${error.name}-${particularError}`,
            result: {},
        });
    } else {
        next();
    }
};