import express from "express";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./data-source";
import * as dotenv from 'dotenv'
import AuthRoutes from "./routes/AuthRoutes";
import productRoutes from "./routes/ProductRoutes";
import cartRoutes from "./routes/CartRoutes";
import { checkAuth, requireAdmin, requireAuth } from "./middlewares/AuthMiddleware";
import OrderRoutes from "./routes/OrderRoutes";
import adminRoutes from "./routes/AdminRoutes";
import cors from "cors";

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        const responseData = {
            ...data,
            currentUser: (req as any).user || null
        };
        return originalJson.call(this, responseData);
    };
    next();
});

app.use("/api/auth",checkAuth, AuthRoutes);
app.use("/api/product",checkAuth, productRoutes);
app.use("/api/cart", requireAuth, cartRoutes);
app.use("/api/order", requireAuth, OrderRoutes);

app.use("/api/admin", requireAuth, requireAdmin, adminRoutes);

app.use("/me",checkAuth, (req, res) => {
    res.json({});
})

AppDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        })
    });