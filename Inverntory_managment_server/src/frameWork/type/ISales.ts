import mongoose from "mongoose";

interface ISaleItem {
    productId: mongoose.Types.ObjectId;
    itemName: string;
    price: number;
    quantity: number;
}

export default interface ISale extends Document {
    customerId: mongoose.Types.ObjectId;
    items: ISaleItem[];
    paymentMethod: string;
    total: number;
    date: Date;
    author: string | mongoose.Types.ObjectId;
}