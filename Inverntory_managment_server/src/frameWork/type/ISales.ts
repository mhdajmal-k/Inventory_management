import mongoose from "mongoose";

export default interface ISale extends Document {
    customerId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId
    itemName: string;
    price: number;
    quantity: number;
    paymentMethod: string;
    total: number;
    date: Date;
    author: string | mongoose.Types.ObjectId

}