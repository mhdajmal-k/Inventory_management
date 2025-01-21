import mongoose from "mongoose";
import ISaleRepository from "../../entities/Irepositories/ISalesRepository";
import Sale from "../../frameWork/database/schema/salesSchema";
import { HttpStatusCode } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import ISale from "../../frameWork/type/ISales";


export default class SaleRepository implements ISaleRepository {
    async createSale(data: ISale): Promise<ISale> {
        console.log(data)
        try {
            const newItem = new Sale({
                customerId: data.customerId,
                itemName: data.itemName,
                price: data.price,
                paymentMethod: data.paymentMethod,
                quantity: data.quantity,
                total: data.total,
                productId: data.productId
            });
            await newItem.save();
            console.log(newItem, "dddddddddddd")
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
    async getSales(): Promise<ISale[]> {
        try {
            const allSales = await Sale.aggregate([
                {
                    $lookup: {
                        from: "customers",
                        localField: "customerId",
                        foreignField: "_id",
                        as: "customerDetails"
                    }
                },
                {
                    $unwind: "$customerDetails",
                },
                {
                    $project: {
                        _id: 1,
                        itemName: 1,
                        price: 1,
                        quantity: 1,
                        paymentMethod: 1,
                        total: 1,
                        date: 1,
                        "customerDetails.name": 1,
                        "customerDetails.email": 1,
                        "customerDetails.phone": 1,
                        "customerDetails.address": 1,
                    },
                }
            ])
            console.log(allSales, "ssssssssssssssssssssssssssssssssssssssssss")
            return allSales
        } catch (error: any) {
            console.log(error.message)
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
        console.log(allSales, "ssssssssssssssssssssssssssssssssssssssssss")
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