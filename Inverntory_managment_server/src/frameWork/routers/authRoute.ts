import { Router } from "express";
import AuthRepository from "../../interface/repositories/authRepositoires";
import UserAuthInteractor from "../../useCases/authUseCase/useCase";
import AuthController from "../../interface/controllers/authController";
import JwtToken from "../service/jwt";
import { config } from "../config/envConfig";
// import { validateSignUp } from "../validator/signUPValidator";
import { validateLogin } from "../validator/loginValidator";
import { validateSignUp } from "../validator/signUPValidator";
import { authorization } from "../middileware/authMilddilware";
// import { authorization } from "../middileware/authMilddilware";

export const userRouter = Router();
const jwtToken = new JwtToken(config.JWT_SECRET, config.JWT_REFRESH_SECRET);
const repository = new AuthRepository();
const interactor = new UserAuthInteractor(repository, jwtToken);
const authController = new AuthController(interactor);

userRouter.post(
    "/signup",
    validateSignUp,
    authController.signUp.bind(authController)
);
userRouter.post(
    "/login",
    validateLogin,
    authController.singIN.bind(authController)
);
userRouter.get(
    "/profile",
    authorization(),
    authController.getProfileData.bind(authController)
);
userRouter.put(
    "/profile",
    // authorization(),
    authController.updateProfileData.bind(authController)
);
userRouter.post(
    "/refreshToken",
    authController.checkRefreshToken.bind(authController)
);
userRouter.post(
    "/logout",
    authController.logout.bind(authController)
);
