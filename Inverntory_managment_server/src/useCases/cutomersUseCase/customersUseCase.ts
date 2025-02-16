import ICustomersRepository from "../../entities/Irepositories/ICustomersRepository";
import ICustomersInteractor from "../../entities/IuseCase/ICustomers";
import { HttpStatusCode, Messages } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import { ICustomers } from "../../frameWork/type/ICustomers";
// import { IItem } from "../../frameWork/type/IproductType";

export default class CustomerInteractor implements ICustomersInteractor {
    constructor(private readonly Repository: ICustomersRepository) { }

    async addCustomers(customer: ICustomers): Promise<{ statusCode: number; status: boolean; message: string; result: ICustomers | null; }> {
        try {

            const addItem = await this.Repository.addCustomer(customer)
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
    async getCustomers(author: string | undefined): Promise<{ statusCode: number; status: boolean; message: string; result: ICustomers[] | null; }> {
        try {
            const customer = await this.Repository.getCustomer(author)
            if (customer) {
                return {
                    statusCode: HttpStatusCode.Created,
                    message: "",
                    result: customer,
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
    async updateCustomers(customersId: string, data: ICustomers): Promise<{ statusCode: number; status: boolean; message: string; result: ICustomers | null; }> {
        try {

            const product = await this.Repository.updateCustomer(customersId, data)
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
    async blockAndUnblockCustomers(customersId: string, block: boolean): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: ICustomers | null;
    }> {
        try {
            const customer = await this.Repository.blockAndUnblock(customersId, block);

            if (customer) {
                return {
                    statusCode: HttpStatusCode.OK,
                    message: Messages.CustomerUpdatedSuccessFully,
                    result: customer,
                    status: true
                };
            } else {
                throw new CustomError(
                    Messages.CustomerUpdateFailed,
                    HttpStatusCode.NotFound
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

}