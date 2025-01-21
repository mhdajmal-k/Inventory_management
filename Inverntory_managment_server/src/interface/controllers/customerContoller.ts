import { NextFunction, Request, Response } from "express";
import ICustomersInteractor from "../../entities/IuseCase/ICustomers";


class CustomersController {
    constructor(private CustomersInteractor: ICustomersInteractor) { }
    async addCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const productDAta = req.body
            const response = await this.CustomersInteractor.addCustomers(productDAta)
            if (response.status) {
                res.status(response.statusCode).json({
                    status: response.status,
                    message: response.message,
                    result: response.result,

                });
            }
        } catch (error) {
            next(error);
        }
    }
    async getCustomers(req: Request, res: Response, next: NextFunction) {
        try {

            const response = await this.CustomersInteractor.getCustomers()
            if (response.status) {
                res.status(response.statusCode).json({
                    status: response.status,
                    message: response.message,
                    result: response.result,

                });
            }
        } catch (error) {
            next(error);
        }
    }
    async updateCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id
            const data = req.body
            const response = await this.CustomersInteractor.updateCustomers(productId, data)
            if (response.status) {
                res.status(response.statusCode).json({
                    status: response.status,
                    message: response.message,
                    result: response.result,

                });
            }
        } catch (error) {
            next(error);
        }
    }
}

export default CustomersController;