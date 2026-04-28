import express from "express";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./data-source";
import * as dotenv from 'dotenv'
import AuthRoutes from "./routes/AuthRoutes";
import productRoutes from "./routes/ProductRoutes";
import cartRoutes from "./routes/CartRoutes";
import { requireAuth } from "./middlewares/AuthMiddleware";
import OrderRoutes from "./routes/OrderRoutes";
dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", requireAuth, cartRoutes);
app.use("/api/order", requireAuth, OrderRoutes);

AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        })
    });