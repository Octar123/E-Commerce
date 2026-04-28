import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import path from "path";
import fs from "fs";
import { SubCategory } from "../entities/SubCateory";

class AdminController {
  private productRepo = AppDataSource.getRepository(Product);
  private subCategoryRepo = AppDataSource.getRepository(SubCategory);

  addProduct = async (req: Request, res: Response) => {
    try {
      const { name, description, price, stockQuantity, subCategoryId } =
        req.body;

      if (!subCategoryId) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Subcategory Field must be provided",
          });
      }

      const imagePath = req.file ? `/productImages/${req.file.filename}` : null;

      const data = this.productRepo.create({
        name,
        description,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        subCategory: { id: subCategoryId },
        imagePath,
      });

      await this.productRepo.save(data);

      res
        .status(201)
        .json({ success: true, message: "Product added Successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error while adding the product" });
    }
  };

  updateProduct = async (req: Request, res: Response) => {

    const id = parseInt(req.params.id as string);
    const { name, description, price, stockQuantity, subCategoryId } =
        req.body;

    const prod = await this.productRepo.findOneBy({
        id
    });

    if(name){
        prod.name = name;
    }
    if(description){
        prod.description = description;
    }
    if(price){
        prod.price = parseFloat(price);
    }
    if(stockQuantity){
        prod.stockQuantity = parseInt(stockQuantity);
    }
    if(req.file){
        if(prod.imagePath) {
            const oldPath = path.join(__dirname, "../..", prod.imagePath);
            if(fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        prod.imagePath = `/productImages/${req.file.filename}`;
    }

    if(subCategoryId) {
        const subCategory = await this.subCategoryRepo.findOneBy({
            id: subCategoryId
        });

        if(!subCategory) {
            return res.status(400).json({success: false, error: "Invalid SubCategory"});
        }
        prod.subCategory = subCategory;
    }

    await this.productRepo.save(prod);

    return res.status(200).json({success: true, message: "Product Updated Successfully"});
  };

  deleteProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);

    const prod = await this.productRepo.findOneBy({
        id
    });

    if(!prod) {
        return res.status(404).json({success: false, error: "Product Not Found"});
    }

    if(prod.imagePath) {
        const fullPath = path.join(__dirname, '../..', prod.imagePath);
        if(fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    await this.productRepo.delete(prod);

    return res.status(200).json({success: true, message: "Product Deleted Successfully"});
  };
}

export const adminController = new AdminController();
