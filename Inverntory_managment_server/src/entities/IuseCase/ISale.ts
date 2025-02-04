import ISale from "../../frameWork/type/ISales";


export default interface ISaleInteractor {

    createSale(product: ISale): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: object | null;
    }>;
    getSalesData(author: string | undefined): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: ISale[] | null;
    }>;
    getOneSalesDataById(id: string): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: ISale | null;
    }>;
    getSalesReport(author: string | undefined): Promise<{
        statusCode: number;
        status: boolean;
        message: string;
        result: any | null;
    }>;
    // deleteProducts(productId: string): Promise<{
    //     statusCode: number;
    //     status: boolean;
    //     message: string;
    //     result: IItem | null;
    // }>;
}