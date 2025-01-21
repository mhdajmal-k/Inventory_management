import mongoose from "mongoose";
import IProductRepository from "../../entities/Irepositories/IProductRepository";
import Product from "../../frameWork/database/schema/productShema";
import { HttpStatusCode, Messages } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import { IItem } from "../../frameWork/type/IproductType";

export default class ProductRepository implements IProductRepository {
    async addProduct(data: IItem): Promise<IItem> {
        try {
            const newItem = new Product({
                name: data.name,
                description: data.description,
                quantity: data.quantity,
                price: data.price,
                totalStockValue: data.totalStockValue
            });

            await newItem.save();
            return newItem
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
    async getProduct(): Promise<IItem[]> {
        try {
            const products = await Product.find({ block: false })
            return products
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
    async updateProductWithId(productId: string, data: IItem): Promise<IItem> {
        try {
            const updatedProduct = await Product.findByIdAndUpdate({ _id: productId }, data, {
                new: true,
                runValidators: true,
            });
            if (!updatedProduct) {
                throw new CustomError(
                    Messages.ProductEditFiled,
                    HttpStatusCode.InternalServerError
                );
            }
            return updatedProduct


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
    async deleteProductWithId(productId: string): Promise<IItem | null> {
        try {
            // Update the 'block' field to true for soft delete
            const deletedProduct = await Product.findByIdAndUpdate(
                productId,
                { $set: { block: true } },
                { new: true } // Return the updated document
            );

            if (!deletedProduct) {
                throw new CustomError(
                    "Product not found",
                    HttpStatusCode.NotFound
                );
            }

            return deletedProduct;
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
    async getProductById(id: mongoose.Types.ObjectId): Promise<IItem> {
        try {
            const products = await Product.findById({ _id: id })
            if (products) {
                return products
            }
            throw new CustomError(
                Messages.InvalidProduct,
                HttpStatusCode.InternalServerError
            );
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
    async updateProductQuantity(productId: mongoose.Types.ObjectId, quantity: number): Promise<IItem | null> {
        try {
            const updateProduct = await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } }, { new: true })
            return updateProduct
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
    async ProductCount(): Promise<number> {
        try {
            const totalProducts = await Product.countDocuments();
            return totalProducts
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
    async ProductReport(): Promise<any> {
        try {
            const productReport = await Product.aggregate([
                {
                    $lookup: {
                        from: "sales",
                        localField: "_id",
                        foreignField: "productId",
                        as: "salesData"
                    }
                },
                {
                    $addFields: {
                        totalUnitsSold: {
                            $sum: "$salesData.quantity"
                        },
                        totalRevenue: {
                            $sum: {
                                $map: {
                                    input: "$salesData",
                                    as: "sale",
                                    in: { $multiply: ["$$sale.quantity", "$price"] }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        name: 1,
                        price: 1,
                        stock: 1,
                        totalUnitsSold: 1,
                        totalRevenue: 1,
                        quantity: 1
                    }
                },
                {
                    $sort: { totalRevenue: -1 } // Sort by total revenue in descending order
                }
            ]);
            return productReport;
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