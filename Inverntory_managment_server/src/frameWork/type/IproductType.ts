import mongoose from "mongoose";

export interface IItem extends Document {
    name: string;
    description: string;
    quantity: number;
    price: number;
    totalStockValue: number;
    block: boolean;
    author: string | mongoose.Types.ObjectId
}