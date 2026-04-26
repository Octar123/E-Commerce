import express from "express";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./data-source";
import * as dotenv from 'dotenv'
import AuthRoutes from "./routes/AuthRoutes";
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoutes)

AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        })
    });