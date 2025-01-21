
import { IItem } from "../../frameWork/type/IproductType";

export default interface IProductInteractor {

    addProduct(product: IItem): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: object | null;
    }>;
    productReport(): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: object | null;
    }>;
    getProducts(): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: IItem[] | null;
    }>;
    updateProducts(productId: string, data: IItem): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: IItem | null;
    }>;
    deleteProducts(productId: string): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: IItem | null;
    }>;
}