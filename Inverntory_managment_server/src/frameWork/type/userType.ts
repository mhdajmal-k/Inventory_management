import { Document } from "mongoose";
import { Request } from "express";
export default interface IUserResult {
    user: string;
    tokenJwt: string | "";
    jwtRefreshToken: string | null;
}

export interface IUser extends Document {
    companyName: string;
    email: string;
    password: string;
}

export interface IUserProfile extends Document {
    companyName: string;
    email: string;
}
export interface IUserLogin extends Document {
    email: string;
    password: string;
}

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}
