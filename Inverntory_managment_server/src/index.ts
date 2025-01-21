import dotenv from "dotenv";
import { connectToDataBase } from "./frameWork/database/mongodb";
import { config } from "./frameWork/config/envConfig";

import { app } from "./frameWork/express/app";
dotenv.config();

(async () => {
    try {
        await connectToDataBase();
        const PORT = config.PORT;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
})();
