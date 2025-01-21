import { Router } from "express";
import ProductRepository from "../../interface/repositories/productRepository";
import ProductInteractor from "../../useCases/productUseCast.ts/useCase";
import ProductController from "../../interface/controllers/productController";
import { validateProductData } from "../validator/productValidator";

export const productRoute = Router();
const repository = new ProductRepository()
const interactor = new ProductInteractor(repository)
const productController = new ProductController(interactor)

productRoute.get(
    "/productReport",
    // validateProductData,
    productController.productReport.bind(productController)
);

productRoute.post(
    "/",
    validateProductData,
    productController.addProduct.bind(productController)
);
productRoute.get(
    "/",
    productController.getProducts.bind(productController)
);
productRoute.put(
    "/:id",
    productController.updateProducts.bind(productController)
);
productRoute.patch(
    "/:id",
    productController.deleteProducts.bind(productController)
);

