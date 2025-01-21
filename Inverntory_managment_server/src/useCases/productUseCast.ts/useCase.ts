import IProductRepository from "../../entities/Irepositories/IProductRepository";
import IProductInteractor from "../../entities/IuseCase/IProduct";
import { HttpStatusCode, Messages } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import { IItem } from "../../frameWork/type/IproductType";

export default class ProductInteractor implements IProductInteractor {
    constructor(private readonly Repository: IProductRepository) { }
    async addProduct(product: IItem): Promise<{ statusCode: number; status: boolean; message: string; result: object | null; }> {
        try {
            const totalStockValue = product.totalStockValue ?? Math.floor(product.quantity * product.price)
            product.totalStockValue = totalStockValue
            const addItem = await this.Repository.addProduct(product)
            if (addItem) {
                return {
                    statusCode: HttpStatusCode.Created,
                    message: Messages.ProductAddedSuccessFully,
                    result: addItem,
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
    async getProducts(): Promise<{ statusCode: number; status: boolean; message: string; result: IItem[] | null; }> {
        try {
            const products = await this.Repository.getProduct()
            if (products) {
                return {
                    statusCode: HttpStatusCode.Created,
                    message: "",
                    result: products,
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
    async updateProducts(productId: string, data: IItem): Promise<{ statusCode: number; status: boolean; message: string; result: IItem | null; }> {
        try {
            console.log(productId, "is the use case product Id")
            console.log(data, "is the use case date")
            const product = await this.Repository.updateProductWithId(productId, data)
            if (product) {
                return {
                    statusCode: HttpStatusCode.OK,
                    message: Messages.ProductUpdatedSuccessFully,
                    result: product,
                    status: true
                }
            } else {
                throw new CustomError(
                    Messages.ProductUpdatedUnSuccessFully,
                    HttpStatusCode.NotFound
                );

            }
        }
        catch (error) {
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
    async deleteProducts(productId: string): Promise<{ statusCode: number; status: boolean; message: string; result: IItem | null; }> {
        try {
            const product = await this.Repository.deleteProductWithId(productId)
            if (product) {
                return {
                    statusCode: HttpStatusCode.Created,
                    message: Messages.ProductDeletedSuccessFully,
                    result: null,
                    status: true
                }
            } else {
                throw new CustomError(
                    Messages.ProductDeletedFailed,
                    HttpStatusCode.InternalServerError
                );

            }
        }
        catch (error) {
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
    async productReport(): Promise<{ statusCode: number; status: boolean; message: string; result: object | null; }> {

        const productCount = await this.Repository.ProductCount()
        const productReport = await this.Repository.ProductReport()
        if (productCount && productReport) {
            return {
                statusCode: HttpStatusCode.Created,
                message: Messages.ProductAddedSuccessFully,
                result: { productCount, productReport },
                status: true
            }
        } else {
            throw new CustomError(
                Messages.ProductAddedUnSuccessFully,
                HttpStatusCode.InternalServerError
            );
        }
    } catch(error: any) {
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

