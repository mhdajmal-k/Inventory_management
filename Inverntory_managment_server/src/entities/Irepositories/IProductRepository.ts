import mongoose from "mongoose";
import { IItem } from "../../frameWork/type/IproductType";

export default interface IProductRepository {
    addProduct(data: IItem): Promise<IItem>
    ProductCount(): Promise<number>
    ProductReport(): Promise<any>
    getProductById(id: mongoose.Types.ObjectId): Promise<IItem>
    getProduct(): Promise<IItem[]>
    updateProductWithId(productId: string, data: IItem): Promise<IItem>
    deleteProductWithId(productId: string): Promise<IItem | null>
    updateProductQuantity(productId: mongoose.Types.ObjectId, quantity: number): Promise<IItem | null>
}