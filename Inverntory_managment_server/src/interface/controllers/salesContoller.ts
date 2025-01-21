import { NextFunction, Response } from "express";
import ISaleInteractor from "../../entities/IuseCase/ISale";
import { AuthenticatedRequest } from "../../frameWork/type/userType";


class SalesController {
    constructor(private SaleInteractor: ISaleInteractor) { }
    async createSale(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const productDAta = req.body
            productDAta.author = req.user?.id
            const response = await this.SaleInteractor.createSale(productDAta)
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
    async getSalesData(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const author = req.user?.id
            const response = await this.SaleInteractor.getSalesData(author)
            console.log(response, "is the resp")
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
    async getSalesDataById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const id = req.params.id
            console.log(req.params)
            const response = await this.SaleInteractor.getOneSalesDataById(id)
            console.log(response, "is the resp")
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
    async getSalesReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const author = req.user?.id
            const response = await this.SaleInteractor.getSalesReport(author)
            console.log(response, "is the resp")
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

export default SalesController;