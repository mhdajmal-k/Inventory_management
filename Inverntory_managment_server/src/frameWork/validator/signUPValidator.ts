import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../helpers/Enums";
import { signUpValidatorSchema } from "../helpers/validator/signUpValidatorShcema";

export const validateSignUp = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { error } = signUpValidatorSchema.validate(req.body);
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
        next(error);
    }
};
