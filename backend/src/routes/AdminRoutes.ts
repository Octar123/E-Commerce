import { Router } from "express";
import { requireAdmin, requireAuth } from "../middlewares/AuthMiddleware";
import { adminController } from "../controllers/AdminController";
import { upload } from "../middlewares/uploadMiddleware";

const adminRoutes = Router();

adminRoutes.post("/addProduct", requireAuth, requireAdmin,upload.single('imagePath'), adminController.addProduct);
adminRoutes.put("/:id", requireAuth, requireAdmin,upload.single('imagePath'), adminController.updateProduct);
adminRoutes.delete("/:id/delete", requireAuth, requireAdmin,upload.single('imagePath'), adminController.deleteProduct);

adminRoutes.get("/getTypes", requireAuth, requireAdmin, adminController.getTypes)