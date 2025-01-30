import IProductRepository from "../../entities/Irepositories/IProductRepository";
import ISaleRepository from "../../entities/Irepositories/ISalesRepository";
import ISaleInteractor from "../../entities/IuseCase/ISale";
import { HttpStatusCode, Messages } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import ISale from "../../frameWork/type/ISales";

export default class SalesInteractor implements ISaleInteractor {
    constructor(private readonly Repository: ISaleRepository, private readonly productRepo: IProductRepository) { }

    async createSale(sale: ISale): Promise<{ statusCode: number; status: boolean; message: string; result: object | null; }> {
        try {
            // Validate all products and check stock
            for (const item of sale.items) {
                const getValidProduct = await this.productRepo.getProductById(item.productId);
                if (!getValidProduct) {
                    return {
                        statusCode: HttpStatusCode.NotFound,
                        message: `${Messages.InvalidProduct}: ${item.itemName}`,
                        result: null,
                        status: true
                    };
                }

                if (getValidProduct.quantity < item.quantity) {
                    return {
                        statusCode: HttpStatusCode.BadRequest,
                        message: `${Messages.InsufficientStock}: ${item.itemName}`,
                        result: null,
                        status: true
                    };
                }
            }

            // Calculate total
            sale.total = sale.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // Create sale
            const createdSale = await this.Repository.createSale(sale);

            if (createdSale) {
                // Update product quantities
                for (const item of sale.items) {
                    await this.productRepo.updateProductQuantity(item.productId, item.quantity);
                }

                return {
                    statusCode: HttpStatusCode.Created,
                    message: Messages.ProductAddedSuccessFully,
                    result: createdSale,
                    status: true
                };
            } else {
                throw new CustomError(
                    Messages.ProductAddedUnSuccessFully,
                    HttpStatusCode.InternalServerError
                );
            }
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) {
                throw new CustomError(
                    error.message,
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }

    async getSalesData(author: string | undefined): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: ISale[] | null;
    }> {
        try {
            const allSales = await this.Repository.getSales(author);
            if (allSales) {
                return {
                    statusCode: HttpStatusCode.OK, // Changed to OK since it's a GET request
                    message: "Sales retrieved successfully",
                    result: allSales,
                    status: true
                };
            } else {
                throw new CustomError(
                    "Failed to retrieve sales",
                    HttpStatusCode.InternalServerError
                );
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw new CustomError(
                    error.message,
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }
    async getOneSalesDataById(id: string): Promise<{ statusCode: number; status: boolean; message: string; result: ISale | null; }> {
        try {
            console.log(id)
            const allSales = await this.Repository.getOneSaleData(id)
            if (allSales) {
                return {
                    statusCode: HttpStatusCode.Created,
                    message: "",
                    result: allSales,
                    status: true
                }
            } else {
                throw new CustomError(
                    Messages.ProductAddedUnSuccessFully,
                    HttpStatusCode.InternalServerError
                );
            }
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw new CustomError(
                    error.message,
                    HttpStatusCode.InternalServerError
                );
            } else {
                throw error;
            }
        }
    }

    async getSalesReport(author: string | undefined): Promise<{ statusCode: number; status: boolean; message: string; result: object | null; }> {
        console.log('hhhhhhhhhhhhhhhhhhhhh')
        const salesCount = await this.Repository.getSaleCount()
        const salesReport = await this.Repository.getSales(author)
        if (salesCount && salesReport) {
            return {
                statusCode: HttpStatusCode.Created,
                message: Messages.ProductAddedSuccessFully,
                result: { salesReport, salesCount },
                status: true
            }
        } else {
            throw new CustomError(
                Messages.ProductAddedUnSuccessFully,
                HttpStatusCode.InternalServerError
            );
        }
    } catch(error: any) {
        console.log("hi")
        if (error instanceof CustomError) {
            throw new CustomError(
                error.message,
                HttpStatusCode.InternalServerError
            );
        } else {
            throw error;
        }
    }

}