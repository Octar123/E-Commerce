import { Router } from "express";
import { productController } from "../controllers/ProductController";

const productRoutes = Router();

productRoutes.post("/all", productController.getAllProducts);
productRoutes.get("/taxo", productController.getTaxonomy);
productRoutes.get("/search", productController.searchProducts);
productRoutes.get("/:id", productController.getSingleProduct);

export default productRoutes;