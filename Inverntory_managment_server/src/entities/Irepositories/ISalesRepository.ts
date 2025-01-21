import ISale from "../../frameWork/type/ISales";

export default interface ISaleRepository {
    createSale(data: ISale): Promise<ISale>
    getSales(author: string | undefined): Promise<ISale[]>
    getOneSaleData(id: string): Promise<ISale>
    getSaleCount(): Promise<number>

    // deleteProductWithId(productId: string): Promise<IItem | null>
}