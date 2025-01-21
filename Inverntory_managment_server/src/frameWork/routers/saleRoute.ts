
import { Router } from "express";
// import { validateCustomersData } from "../validator/CustomersValidator";
import SaleRepository from "../../interface/repositories/salesRepository";
import SalesController from "../../interface/controllers/salesContoller";
import SalesInteractor from "../../useCases/salseUseCase/salesUseCase";
import ProductRepository from "../../interface/repositories/productRepository";

export const salesRoute = Router();
const repository = new SaleRepository()
const productRepository = new ProductRepository()
const interactor = new SalesInteractor(repository, productRepository)
const salesController = new SalesController(interactor)

salesRoute.get(
    "/salesReport",
    // validateCustomersData,
    salesController.getSalesReport.bind(salesController)
);


salesRoute.post(
    "/",
    // validateCustomersData,
    salesController.createSale.bind(salesController)
);
salesRoute.get(
    "/",
    // validateCustomersData,
    salesController.getSalesData.bind(salesController)
);
salesRoute.get(
    "/:id",
    // validateCustomersData,
    salesController.getSalesDataById.bind(salesController)
);


