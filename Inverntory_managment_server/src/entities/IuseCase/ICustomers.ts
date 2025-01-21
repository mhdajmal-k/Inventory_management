import { ICustomers } from "../../frameWork/type/ICustomers";


export default interface ICustomersInteractor {

    addCustomers(product: ICustomers): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: ICustomers | null;
    }>;
    getCustomers(author: string | undefined): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: ICustomers[] | null;
    }>;
    updateCustomers(productId: string, data: ICustomers): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: ICustomers | null;
    }>;

}