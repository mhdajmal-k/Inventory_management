import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "../routers/route";
import { errorHandler } from "../middileware/errorHandiler";
import { corsOptions } from "../config/corsConfig";


export const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
// app.use(apiLimiter);
routes(app);
app.use(errorHandler);
