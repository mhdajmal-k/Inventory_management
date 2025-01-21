import { model, Schema } from "mongoose";
import { IItem } from "../../type/IproductType";

const itemSchema = new Schema<IItem>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0.01 },
        totalStockValue: { type: Number, required: true, min: 0.01 },
        block: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const product = model<IItem>("product", itemSchema);
export default product;
