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

adminRoutes.put("/:typeId/updateType", adminController.updateType);
adminRoutes.put("/:categoryId/updateCategory", adminController.updateCategory);
adminRoutes.put("/:subCategoryId/updateSubCategory", adminController.updateSubCategory);

adminRoutes.post("/addType", adminController.addType);
adminRoutes.post("/:typeId/addCategory", adminController.addCategory);
adminRoutes.post("/:categoryId/addSubCategory", adminController.addSubCategory);

adminRoutes.delete("/:typeId/deleteType", adminController.deleteType);
adminRoutes.delete("/:categoryId/deleteCategory", adminController.deleteCategory);
adminRoutes.delete("/:subCategoryId/deleteSubCategory", adminController.deleteSubCategory);

// adminRoutes.get("/users", adminController.getUsers);

export default adminRoutes;