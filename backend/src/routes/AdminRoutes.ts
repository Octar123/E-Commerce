import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/AuthMiddleware";
import { adminController } from "../controllers/AdminController";
import { upload } from "../middlewares/uploadMiddleware";

const adminRoutes = Router();

adminRoutes.post("/add",upload.single('imagePath'), adminController.addProduct);
adminRoutes.put("/:id",upload.single('imagePath'), adminController.updateProduct);
adminRoutes.delete("/:id/delete", adminController.deleteProduct);

adminRoutes.get("/getTypes", adminController.getTypes);
adminRoutes.get("/:typeId/getCategory", adminController.getCategory);
adminRoutes.get("/:categoryId/getSubCategory", adminController.getSubCategory);

adminRoutes.put("/:typeId/update", adminController.updateType)

export default adminRoutes;