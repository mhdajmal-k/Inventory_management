import { NextFunction, Request, Response } from "express";
import ISaleInteractor from "../../entities/IuseCase/ISale";


class SalesController {
    constructor(private SaleInteractor: ISaleInteractor) { }
    async createSale(req: Request, res: Response, next: NextFunction) {
        try {
            const productDAta = req.body
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
    async getSalesData(req: Request, res: Response, next: NextFunction) {
        try {

            const response = await this.SaleInteractor.getSalesData()
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
    async getSalesDataById(req: Request, res: Response, next: NextFunction) {
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
    async getSalesReport(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiii")
            const response = await this.SaleInteractor.getSalesReport()
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