/* eslint-disable @typescript-eslint/no-unused-vars */
import iUserRepository from "../../entities/Irepositories/IauthRepository";
import { iJwtService } from "../../entities/Iservice/IjwtService";
import IUserAuthInteractor from "../../entities/IuseCase/IAuthuser";
import { HttpStatusCode, Messages } from "../../frameWork/helpers/Enums";
import { comparePassword } from "../../frameWork/helpers/passwordHelpers";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import IUserResult, { IUser, IUserLogin, IUserProfile } from "../../frameWork/type/userType";

class UserAuthInteractor implements IUserAuthInteractor {
    constructor(
        private readonly Repository: iUserRepository,
        private readonly jwt: iJwtService
    ) { }
    async userSingUp(user: IUser): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: IUserResult | null;
    }> {
        try {
            const userAlreadyExist = await this.Repository.userAlreadyExist(
                user.email
            );
            if (userAlreadyExist) {
                throw new CustomError(
                    Messages.UserAlreadyExists,
                    HttpStatusCode.Forbidden
                );
            }
            const creatingNewUser = await this.Repository.createUser(user);
            if (!creatingNewUser) {
                throw new CustomError(
                    Messages.FiledToCarteNewUser,
                    HttpStatusCode.Forbidden
                );
            }
            const jwtToken = this.jwt.generateToken(creatingNewUser.id);
            const jwtRefreshToken = this.jwt.generateRefreshToken(creatingNewUser.id);
            return {
                status: true,
                message: `Signup successful! Welcome, ${creatingNewUser.companyName}.`,
                statusCode: HttpStatusCode.Created,
                result: {
                    user: creatingNewUser?.companyName,
                    tokenJwt: jwtToken,
                    jwtRefreshToken: jwtRefreshToken,
                },
            };
        } catch (error: unknown) {
            if (error instanceof CustomError) {
                throw new CustomError(
                    error.message,
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }
    async userLogin(user: IUserLogin): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: object | null;
    }> {
        try {
            const validUser = await this.Repository.validUser(user.email);
            if (!validUser) {
                throw new CustomError(Messages.InvalidEmail, HttpStatusCode.Forbidden);
            }

            const validPassword = comparePassword(user.password, validUser.password);
            if (!validPassword) {
                throw new CustomError(
                    Messages.IncorrectPassword,
                    HttpStatusCode.Forbidden
                );
            }
            const jwtAccessToken = this.jwt.generateToken(String(validUser._id));
            const jwtRefreshToken = this.jwt.generateRefreshToken(
                String(validUser._id)
            );
            return {
                status: true,
                message: `Welcome Back, ${validUser.companyName}.`,
                statusCode: HttpStatusCode.Created,
                result: {
                    user: validUser?.companyName,
                    tokenJwt: jwtAccessToken,
                    jwtRefreshToken: jwtRefreshToken,
                },
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw new CustomError(
                    error.message,
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }
    async userProfileData(id: string | undefined): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        result: any;
    }> {
        try {
            const userData = await this.Repository.getId(id);
            const { password, ...withOutUserData } = userData;
            return {
                statusCode: HttpStatusCode.OK,
                status: true,
                message: "",
                result: withOutUserData,
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw new CustomError(
                    error.message,
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }
    async checkRefreshToken(token: string): Promise<{
        status: boolean;
        message: string;
        result: string | null;
        statusCode: number;
    }> {
        try {
            const verifyRefreshToken = this.jwt.VerifyTokenRefresh(token);
            const existUser = await this.Repository.getId(verifyRefreshToken?.id);
            if (!existUser) {
                return {
                    statusCode: 404,
                    status: false,
                    message: Messages.UserNotFound,
                    result: null,
                };
            }

            if (existUser.block) {
                return {
                    statusCode: 401,
                    status: false,
                    message: Messages.Block,
                    result: null,
                };
            }

            const newJwtAccessToken = this.jwt.generateToken(existUser._id);
            return {
                statusCode: 201,
                status: true,
                message: "Access token refreshed successfully.",
                result: newJwtAccessToken,
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw new CustomError(
                    error.message,
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }

}

export default UserAuthInteractor;
