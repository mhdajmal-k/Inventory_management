// 

import { Router } from "express";
import CustomersController from "../../interface/controllers/customerContoller";
import CustomersRepository from "../../interface/repositories/customerRepository";
import { validateCustomersData } from "../validator/CustomersValidator";
import CustomerInteractor from "../../useCases/cutomersUseCase/customersUseCase";

export const customerRoute = Router();
const repository = new CustomersRepository()
const interactor = new CustomerInteractor(repository)
const customersController = new CustomersController(interactor)

customerRoute.post(
    "/",
    validateCustomersData,
    customersController.addCustomers.bind(customersController)
);
customerRoute.get(
    "/",
    customersController.getCustomers.bind(customersController)
);
customerRoute.put(
    "/:id",
    validateCustomersData,
    customersController.updateCustomers.bind(customersController)
);
