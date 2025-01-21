import { Application } from "express";
import { userRouter } from "./authRoute";
import { productRoute } from "./productRoute";
import { customerRoute } from "./customerRoute";
import { salesRoute } from "./saleRoute";



const routes = (app: Application) => {
  app.use("/api/user/", userRouter);
  app.use("/api/product/", productRoute);
  app.use("/api/customer/", customerRoute);
  app.use("/api/sales/", salesRoute);
};
export default routes;
