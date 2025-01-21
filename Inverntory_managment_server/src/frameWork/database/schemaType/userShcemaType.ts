import { Document } from "mongoose";

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string | number;
    dob: Date;
    articlePreferences: string[];
    profilePicture?: string;
    block?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
