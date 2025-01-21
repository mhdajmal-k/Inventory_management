import iUserRepository from "../../entities/Irepositories/IauthRepository";
import User from "../../frameWork/database/schema/userSchema";
import { HttpStatusCode } from "../../frameWork/helpers/Enums";
import { hashPassword } from "../../frameWork/helpers/passwordHelpers";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import { IUser, IUserProfile } from "../../frameWork/type/userType";

class AuthRepository implements iUserRepository {
    async userAlreadyExist(email: string): Promise<boolean> {
        console.log("in here")
        console.log(email, "is the email")
        const user = await User.findOne({ email: email }).lean();
        return !!user;
    }
    async createUser(data: IUser): Promise<IUser> {
        try {
            const hashedPassword = hashPassword(data.password);
            const newUser = new User({
                companyName: data.companyName,
                email: data.email,
                password: hashedPassword,
            });
            const savedUser = await newUser.save();
            return savedUser as IUser;
        } catch (error) {
            if (error instanceof Error) {
                throw new CustomError(
                    error.message || "An unexpected error occurred",
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }
    async validUser(email: string): Promise<IUser> {
        try {
            const user = await User.findOne({ email: email }).lean();
            return user as IUser;
        } catch (error) {
            if (error instanceof Error) {
                throw new CustomError(
                    error.message || "An unexpected error occurred",
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }
    async getId(id: string): Promise<IUser> {
        try {
            const user = await User.findById({ _id: id }).lean();
            return user as IUser;
        } catch (error) {
            if (error instanceof Error) {
                throw new CustomError(
                    error.message || "An unexpected error occurred",
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }
    async getIdAndUpdate(
        id: string | undefined,
        data: IUserProfile
    ): Promise<IUser> {
        try {
            console.log(data, "in the final repo");
            const user = await User.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            }).lean();
            return user as IUser;
        } catch (error) {
            if (error instanceof Error) {
                throw new CustomError(
                    error.message || "An unexpected error occurred",
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }
}

export default AuthRepository;
