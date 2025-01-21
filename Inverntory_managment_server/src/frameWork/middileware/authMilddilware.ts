/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Response } from "express";
import { config } from "../config/envConfig";
import { HttpStatusCode, Messages } from "../helpers/Enums";
import JwtToken from "../service/jwt";
import AuthRepository from "../../interface/repositories/authRepositoires";
import { AuthenticatedRequest } from "../type/userType";

export const authorization =
    () =>
        async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

            const userToken = req.cookies.User_AccessToken;
            const jwt = new JwtToken(config.JWT_SECRET, config.JWT_REFRESH_SECRET);
            let decodeToken;
            try {
                decodeToken = jwt.verifyToken(userToken);

                if (!decodeToken) {
                    return res.status(HttpStatusCode.Unauthorized).json({
                        message: Messages.AuthenticatedError,
                        result: {},
                        status: false,
                    });
                }

                if (decodeToken) {
                    const userRepository = new AuthRepository();
                    const existUser = await userRepository.getId(decodeToken.id);
                    if (!existUser) {
                        return res.status(HttpStatusCode.Unauthorized).json({
                            message: !existUser ? Messages.UserNotFound : Messages.Block,
                            result: {},
                            status: false,
                        });
                    }
                }

                req.user = { id: decodeToken.id };
                next();
            } catch (error: any) {
                return res.status(HttpStatusCode.InternalServerError).json({
                    message: error.message,
                    result: {},
                    status: false,
                });
            }
        };
