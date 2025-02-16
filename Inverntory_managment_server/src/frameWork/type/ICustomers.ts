import mongoose from "mongoose";


export interface ICustomers extends Document {
    name: string;
    address: string;
    mobile: string;
    gender: string;
    email: string,
    author: string | mongoose.Types.ObjectId,
    block: Boolean

}