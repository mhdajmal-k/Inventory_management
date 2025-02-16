import ICustomersRepository from "../../entities/Irepositories/ICustomersRepository";
import Customer from "../../frameWork/database/schema/customersSchema";
import { HttpStatusCode, Messages } from "../../frameWork/helpers/Enums";
import { CustomError } from "../../frameWork/middileware/errorHandiler";
import { ICustomers } from "../../frameWork/type/ICustomers";

export default class CustomersRepository implements ICustomersRepository {
    async addCustomer(data: ICustomers): Promise<ICustomers> {
        try {
            const newCustomer = new Customer({
                name: data.name,
                address: data.address,
                email: data.email,
                mobile: data.mobile,
                gender: data.gender,
                author: data.author

            });

            await newCustomer.save();
            return newCustomer
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
    async getCustomer(author: string | undefined): Promise<ICustomers[]> {
        try {
            const products = await Customer.find({ author: author })
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
    async updateCustomer(customerId: string, data: ICustomers): Promise<ICustomers> {
        try {
            const updatedProduct = await Customer.findByIdAndUpdate({ _id: customerId }, data, {
                new: true,
                runValidators: true,
            });
            if (!updatedProduct) {
                throw new CustomError(
                    Messages.CustomerEditFiled,
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
    async blockAndUnblock(customersId: string, block: boolean): Promise<ICustomers | null> {
        try {
            const updatedCustomer = await Customer.findByIdAndUpdate(
                customersId,
                { block },
                { new: true, runValidators: true } // Ensures updated document is returned
            );

            if (!updatedCustomer) {
                throw new CustomError(
                    Messages.Block,
                    HttpStatusCode.NotFound
                );
            }

            return updatedCustomer;

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