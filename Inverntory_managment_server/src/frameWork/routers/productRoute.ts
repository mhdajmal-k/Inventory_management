import { Router } from "express";
import ProductRepository from "../../interface/repositories/productRepository";
import ProductInteractor from "../../useCases/productUseCast.ts/useCase";
import ProductController from "../../interface/controllers/productController";
import { validateProductData } from "../validator/productValidator";
import { authorization } from "../middileware/authMilddilware";
// import { authorization } from "../middileware/authMilddilware";

export const productRoute = Router();
const repository = new ProductRepository()
const interactor = new ProductInteractor(repository)
const productController = new ProductController(interactor)

productRoute.get(
    "/productReport",
    // validateProductData,
    authorization(),
    productController.productReport.bind(productController)
);

productRoute.post(
    "/",
    validateProductData,
    authorization(),
    productController.addProduct.bind(productController)
);
productRoute.get(
    "/",
    authorization(),
    productController.getProducts.bind(productController)
);
productRoute.put(
    "/:id",
    authorization(),
    productController.updateProducts.bind(productController)
);
productRoute.patch(
    "/:id",
    authorization(),
    productController.deleteProducts.bind(productController)
);

