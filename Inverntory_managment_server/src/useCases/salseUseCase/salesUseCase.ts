import IProductRepository from "../../entities/Irepositories/IProductRepository";
import ISaleRepository from "../../entities/Irepositories/ISalesRepository";
import ISaleInteractor from "../../entities/IuseCase/ISale";
import { HttpStatusCode, Messages } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import ISale from "../../frameWork/type/ISales";

export default class SalesInteractor implements ISaleInteractor {
    constructor(private readonly Repository: ISaleRepository, private readonly productRepo: IProductRepository) { }

    async createSale(product: ISale): Promise<{ statusCode: number; status: boolean; message: string; result: object | null; }> {
        try {
            const getValidProduct = await this.productRepo.getProductById(product.productId)
            if (!getValidProduct) {
                return {
                    statusCode: HttpStatusCode.NotFound,
                    message: Messages.InvalidProduct,
                    result: null,
                    status: true
                }
            }
            if (getValidProduct.quantity < product.quantity) {
                return {
                    statusCode: HttpStatusCode.BadRequest,
                    message: Messages.InsufficientStock,
                    result: null,
                    status: true
                }
            }
            const total = product.price * product.quantity
            product.total = total
            const sale = await this.Repository.createSale(product)
            if (sale) {
                await this.productRepo.updateProductQuantity(product.productId, product.quantity)

                return {
                    statusCode: HttpStatusCode.Created,
                    message: Messages.ProductAddedSuccessFully,
                    result: sale,
                    status: true
                }
            } else {
                throw new CustomError(
                    Messages.ProductAddedUnSuccessFully,
                    HttpStatusCode.InternalServerError
                );
            }
        } catch (error) {
            console.log(error)
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
    async getSalesData(): Promise<{ statusCode: number; status: boolean; message: string; result: ISale[] | null; }> {
        try {
            const allSales = await this.Repository.getSales()
            console.log(allSales, "is teh use")
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

    async getSalesReport(): Promise<{ statusCode: number; status: boolean; message: string; result: object | null; }> {
        console.log('hhhhhhhhhhhhhhhhhhhhh')
        const salesCount = await this.Repository.getSaleCount()
        const salesReport = await this.Repository.getSales()
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