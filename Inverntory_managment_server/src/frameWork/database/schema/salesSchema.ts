import { model, Schema } from "mongoose";
import ISale from "../../type/ISales";

const saleSchema = new Schema<ISale>({
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    total: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    author: { type: String, required: true, index: true }

});

const Sale = model<ISale>("Sale", saleSchema);

export default Sale;