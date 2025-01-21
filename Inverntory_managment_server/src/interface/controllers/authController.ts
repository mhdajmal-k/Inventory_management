import { NextFunction, Request, Response } from "express";

import IUserResult, { AuthenticatedRequest, IUser } from "../../frameWork/type/userType";
import IUserAuthInteractor from "../../entities/IuseCase/IAuthuser";
import { HttpStatusCode, Messages } from "../../frameWork/helpers/Enums";

class AuthController {
    constructor(private AuthInteractor: IUserAuthInteractor) { }
    async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userDat = req.body;
            const response = await this.AuthInteractor.userSingUp(userDat);
            console.log(response, "is the response");
            if (response.status) {
                const data = response.result as IUserResult;
                res.cookie("User_AccessToken", data.tokenJwt, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 20 * 60 * 1000,
                });
                res.cookie("User_RefreshToken", data.jwtRefreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(response.statusCode).json({
                    status: response.status,
                    message: response.message,
                    result: response.result,
                });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async singIN(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userDat = req.body;
            const response = await this.AuthInteractor.userLogin(userDat);

            if (response.status) {
                const data = response.result as IUserResult;

                res.cookie("User_AccessToken", data.tokenJwt, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 20 * 60 * 1000,
                });
                res.cookie("User_RefreshToken", data.jwtRefreshToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                res.status(response.statusCode).json({
                    status: response.status,
                    message: response.message,
                    result: response.result,
                });
            }
        } catch (error) {
            next(error);
        }
    }
    async getProfileData(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.user?.id;

            const response = await this.AuthInteractor.userProfileData(userId);
            if (response.status) {
                const data = response.result as IUser;
                res.status(response.statusCode).json({
                    status: response.status,
                    message: response.message,
                    result: data,
                });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updateProfileData(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.user?.id;
            const data = req.body;

            const response = await this.AuthInteractor.updateProfileData(
                String(userId),
                data
            );
            if (response.status) {
                const data = response.result as IUser;

                res.status(response.statusCode).json({
                    status: response.status,
                    message: response.message,
                    result: data,
                });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async checkRefreshToken(
        req: Request,
        res: Response,
        next: NextFunction
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        try {
            console.log("in refersh token ddddddddddddddddd");
            const refreshToken = req.cookies.User_RefreshToken;
            if (!refreshToken) {
                return res.status(HttpStatusCode.Unauthorized).json({
                    status: false,
                    message: Messages.MissingRefresh,
                    result: {},
                });
            }
            console.log(refreshToken);
            const response = await this.AuthInteractor.checkRefreshToken(
                refreshToken
            );

            if (response.status) {
                res.cookie("User_AccessToken", response.result, {
                    httpOnly: true,
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000,
                });
                return res.status(HttpStatusCode.OK).json({
                    status: true,
                    message: Messages.CreatedAccess,
                    result: {},
                });
            } else {
                return res.status(401).json({
                    status: false,
                    message: response.message,
                    result: {},
                });
            }
        } catch (error) {
            next(error);
        }
    }
    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.clearCookie("User_AccessToken");
            res.clearCookie("User_RefreshToken");
            res.status(HttpStatusCode.OK).json({
                status: true,
                message: Messages.UserLogOut,
                result: {},
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
