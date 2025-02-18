import { IUser, IUserLogin, IUserProfile } from "../../frameWork/type/userType";


interface IUserAuthInteractor {
    userSingUp(user: IUser): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: object | null;
    }>;
    userLogin(user: IUserLogin): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: object | null;
    }>;

    checkRefreshToken(
        token: string
    ): Promise<{
        status: boolean;
        message: string;
        result: string | null;
        statusCode: number;
    }>;

}

export default IUserAuthInteractor;
