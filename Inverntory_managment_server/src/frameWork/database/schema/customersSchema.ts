import { model, Schema } from "mongoose";
import { ICustomer } from "../schemaType/customersTypes";

const CustomerSchema = new Schema<ICustomer>({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Mobile number must be 10 digits'],
    },
    block: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    author: { type: String, required: true, index: true }

}, { timestamps: true });

const Customer = model<ICustomer>('Customer', CustomerSchema);
export default Customer;