import { NextFunction, Request, Response } from "express";
import ICustomersInteractor from "../../entities/IuseCase/ICustomers";
import { AuthenticatedRequest } from "../../frameWork/type/userType";


class CustomersController {
    constructor(private CustomersInteractor: ICustomersInteractor) { }
    async addCustomers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const productDAta = req.body
            productDAta.author = req.user?.id
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
    async getCustomers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const author = req.user?.id
            const response = await this.CustomersInteractor.getCustomers(author)
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
    async blockAndUnblockCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const customerId = req.params.id;
            const { block } = req.body;
            console.log(block)
            console.log(customerId)
            if (typeof block !== "boolean") {
                res.status(400).json({
                    status: false,
                    message: "Invalid block value. It should be a boolean."
                });
            }

            const response = await this.CustomersInteractor.blockAndUnblockCustomers(customerId, block);

            res.status(response.statusCode).json({
                status: response.status,
                message: response.message,
                result: response.result,
            });

        } catch (error) {
            next(error);
        }
    }

}

export default CustomersController;