import { NextFunction, Request, Response } from "express";
import IProductInteractor from "../../entities/IuseCase/IProduct";


class ProductController {
    constructor(private ProductInteractor: IProductInteractor) { }
    async addProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const productDAta = req.body
            const response = await this.ProductInteractor.addProduct(productDAta)
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
    async getProducts(req: Request, res: Response, next: NextFunction) {
        try {

            const response = await this.ProductInteractor.getProducts()
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
    async updateProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id
            console.log(productId, 'si the contorler')
            const data = req.body
            const response = await this.ProductInteractor.updateProducts(productId, data)
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
    async deleteProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id
            const response = await this.ProductInteractor.deleteProducts(productId)
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
    async productReport(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.ProductInteractor.productReport()
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

export default ProductController;