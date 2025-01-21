
import { Router } from "express";
// import { validateCustomersData } from "../validator/CustomersValidator";
import SaleRepository from "../../interface/repositories/salesRepository";
import SalesController from "../../interface/controllers/salesContoller";
import SalesInteractor from "../../useCases/salseUseCase/salesUseCase";
import ProductRepository from "../../interface/repositories/productRepository";
import { authorization } from "../middileware/authMilddilware";

export const salesRoute = Router();
const repository = new SaleRepository()
const productRepository = new ProductRepository()
const interactor = new SalesInteractor(repository, productRepository)
const salesController = new SalesController(interactor)

salesRoute.get(
    "/salesReport",
    // validateCustomersData,
    authorization(),
    salesController.getSalesReport.bind(salesController)
);


salesRoute.post(
    "/",
    // validateCustomersData,
    authorization(),
    salesController.createSale.bind(salesController)
);
salesRoute.get(
    "/",
    // validateCustomersData,
    authorization(),
    salesController.getSalesData.bind(salesController)
);
salesRoute.get(
    "/:id",
    // validateCustomersData,
    authorization(),
    salesController.getSalesDataById.bind(salesController)
);


