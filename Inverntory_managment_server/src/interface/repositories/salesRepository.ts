import mongoose from "mongoose";
import ISaleRepository from "../../entities/Irepositories/ISalesRepository";
import Sale from "../../frameWork/database/schema/salesSchema";
import { HttpStatusCode } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import ISale from "../../frameWork/type/ISales";


export default class SaleRepository implements ISaleRepository {
    async createSale(data: ISale): Promise<ISale> {
        try {
            console.log(data, "in the create sale")
            const newSale = new Sale({
                customerId: data.customerId,
                items: data.items,
                paymentMethod: data.paymentMethod,
                total: data.total,
                author: data.author
            });

            await newSale.save();
            return newSale;
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
    async getSales(author: string | undefined): Promise<ISale[]> {
        try {
            const allSales = await Sale.aggregate([
                {
                    $match: { author: author }
                },
                {
                    $lookup: {
                        from: "customers",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerDetails"
                    }
                },
                {
                    $unwind: "$customerDetails"
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "items.productId",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                {
                    $addFields: {
                        "items": {
                            $map: {
                                input: "$items",
                                as: "item",
                                in: {
                                    $mergeObjects: [
                                        "$$item",
                                        {
                                            productDetails: {
                                                $arrayElemAt: [
                                                    {
                                                        $filter: {
                                                            input: "$productDetails",
                                                            cond: {
                                                                $eq: ["$$this._id", "$$item.productId"]
                                                            }
                                                        }
                                                    },
                                                    0
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        paymentMethod: 1,
                        total: 1,
                        items: {
                            productId: 1,
                            itemName: 1,
                            price: 1,
                            quantity: 1,
                            "productDetails.name": 1,
                            "productDetails.category": 1
                        },
                        customerDetails: {
                            name: 1,
                            email: 1,
                            mobile: 1,
                            address: 1
                        }
                    }
                },
                {
                    $sort: { date: -1 }
                }
            ]);

            return allSales;
        } catch (error: any) {
            console.error("Error in getSales:", error.message);
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
    async getOneSaleData(id: string): Promise<ISale> {
        const allSales = await Sale.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "customers",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerDetails"
                }
            },
        ])

        return allSales[0]
    } catch(error: any) {
        console.log(error)
        if (error instanceof Error) {
            throw new CustomError(
                error.message || "An unexpected error occurred",
                HttpStatusCode.InternalServerError
            );
        } else {
            throw error;
        }

    }

    async getSaleCount(): Promise<any> {
        try {
            const saleData = await Sale.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$total" },
                        totalTransactions: { $count: {} },
                        averageOrderValue: { $avg: "$total" }
                    }
                }
            ]);
            return saleData
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