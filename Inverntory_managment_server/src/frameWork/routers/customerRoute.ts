// 

import { Router } from "express";
import CustomersController from "../../interface/controllers/customerContoller";
import CustomersRepository from "../../interface/repositories/customerRepository";
import { validateCustomersData } from "../validator/CustomersValidator";
import CustomerInteractor from "../../useCases/cutomersUseCase/customersUseCase";
import { authorization } from "../middileware/authMilddilware";

export const customerRoute = Router();
const repository = new CustomersRepository()
const interactor = new CustomerInteractor(repository)
const customersController = new CustomersController(interactor)

customerRoute.post(
    "/",
    validateCustomersData,
    authorization(),
    customersController.addCustomers.bind(customersController)
);
customerRoute.get(
    "/",
    authorization(),
    customersController.getCustomers.bind(customersController)
);
customerRoute.put(
    "/:id",
    validateCustomersData,
    authorization(),
    customersController.updateCustomers.bind(customersController)
);
customerRoute.patch(
    "/blockAndUnblock/:id",
    authorization(),
    customersController.blockAndUnblockCustomers.bind(customersController)
);

