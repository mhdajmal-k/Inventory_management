import { Schema, model } from "mongoose";
import { IUser } from "../../type/userType";

const userSchema = new Schema<IUser>(
    {
        companyName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
);

const User = model<IUser>("User", userSchema);
export default User;
