import { Router } from "express";
import { productController } from "../controllers/ProductController";

const productRoutes = Router();

productRoutes.get("/all", productController.getAllProducts)

export default productRoutes;