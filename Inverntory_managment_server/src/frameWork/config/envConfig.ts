import dotenv from "dotenv";
dotenv.config();
export const config = {
    PORT: process.env.PORT || 3003,
    DATABASE_URL: process.env.DATABASE_URL || "",
    JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
    JWT_REFRESH_SECRET:
        process.env.JWT_REFRESH_SECRET || "your_jwtJWT_REFRESH_SECRET",
    CORS_ORIGIN: process.env.CORS_ORIGIN,
};
