import { Router } from "express";
import { productController } from "../controllers/ProductController";

const productRoutes = Router();

productRoutes.get("/all", productController.getAllProducts);
productRoutes.get("/taxo", productController.getTaxonomy);

export default productRoutes;