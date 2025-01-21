import { ICustomers } from "../../frameWork/type/ICustomers";

export default interface ICustomersRepository {
    addCustomer(data: ICustomers): Promise<ICustomers>
    getCustomer(author: string | undefined): Promise<ICustomers[]>
    updateCustomer(productId: string, data: ICustomers): Promise<ICustomers>
}