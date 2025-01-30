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
                totalStockValue: data.totalStockValue,
                author: data.author
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
    async getProduct(author: string): Promise<IItem[]> {
        try {
            const products = await Product.find({ block: false, author: author })
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
            const deletedProduct = await Product.findByIdAndUpdate(
                productId,
                { $set: { block: true } },
                { new: true }
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
    // async ProductReport(author: string | undefined): Promise<any> {
    //     try {
    //         const productReport = await Product.aggregate([
    //             { $match: { author: author, block: false } },
    //             {
    //                 $lookup: {
    //                     from: "sales",
    //                     localField: "_id",
    //                     foreignField: "items.productId",
    //                     as: "salesData"
    //                 }
    //             },
    //             { $unwind: { path: "$salesData", preserveNullAndEmptyArrays: true } }, // Unwind salesData
    //             { $unwind: { path: "$salesData.items", preserveNullAndEmptyArrays: true } },
    //             {
    //                 $addFields: {
    //                     totalUnitsSold: {
    //                         $sum: "$salesData.items.quantity"
    //                     },
    //                     totalRevenue: {
    //                         $sum: {
    //                             $map: {
    //                                 input: "$salesData.items.quantity",
    //                                 as: "sale",
    //                                 in: { $multiply: ["$$sale.items.quantity", "$sale.items.price"] }
    //                             }
    //                         }
    //                     }
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     name: 1,
    //                     price: 1,
    //                     stock: 1,
    //                     totalUnitsSold: 1,
    //                     totalRevenue: 1,
    //                     quantity: 1
    //                 }
    //             },
    //             {
    //                 $sort: { totalRevenue: -1 }
    //             }
    //         ]);
    //         return productReport;
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             throw new CustomError(
    //                 error.message || "An unexpected error occurred",
    //                 HttpStatusCode.InternalServerError
    //             );
    //         } else {
    //             throw error;
    //         }
    //     }
    // }

    async ProductReport(author: string | undefined): Promise<any> {
        try {
            const productReport = await Product.aggregate([
                { $match: { author: author, block: false } },
                {
                    $lookup: {
                        from: "sales",
                        localField: "_id",
                        foreignField: "items.productId",
                        as: "salesData"
                    }
                },
                { $unwind: { path: "$salesData", preserveNullAndEmptyArrays: true } },
                { $unwind: { path: "$salesData.items", preserveNullAndEmptyArrays: true } },
                {
                    $match: {
                        "salesData.items.productId": { $exists: true }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        price: { $first: "$price" },
                        stock: { $first: "$quantity" },
                        totalUnitsSold: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$salesData.items.productId", "$_id"] },
                                    "$salesData.items.quantity",
                                    0
                                ]
                            }
                        },
                        totalRevenue: {
                            $sum: {
                                $multiply: [
                                    {
                                        $cond: [
                                            { $eq: ["$salesData.items.productId", "$_id"] },
                                            "$salesData.items.quantity",
                                            0
                                        ]
                                    },
                                    "$salesData.items.price"
                                ]
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
                    }
                },
                { $sort: { totalRevenue: -1 } }
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