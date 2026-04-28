import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import path from "path";
import fs from "fs";
import { SubCategory } from "../entities/SubCateory";
import { Type } from "../entities/Type";
import { Category } from "../entities/Category";
import { User, UserRole } from "../entities/User";
import { sessionStore } from "../utils/sessionStore";
import { Order } from "../entities/Order";

class AdminController {
    private typeRepo = AppDataSource.getRepository(Type);
    private categoryRepo = AppDataSource.getRepository(Category);
    private subCategoryRepo = AppDataSource.getRepository(SubCategory);
    private productRepo = AppDataSource.getRepository(Product);
    private userRepo = AppDataSource.getRepository(User);
    private orderRepo = AppDataSource.getRepository(Order);

  addProduct = async (req: Request, res: Response) => {
    try {
      let { name, description, price, stockQuantity, subCategoryId } =
        req.body;

      if (!subCategoryId) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Subcategory Field must be provided",
          });
      }

      if(!name){
        return res.status(400).json({success: false, error: "Name should be provided"});
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
        console.error(error);
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

    await this.productRepo.delete(prod.id);


    return res.status(200).json({success: true, message: "Product Deleted Successfully"});
  };



  getTypes = async (req: Request, res: Response) => {
    const types = await this.typeRepo.find();

    return res.json(types);
  }

  getCategory = async (req: Request, res: Response) => {
    const typeId = parseInt(req.params.typeId as string);

    const category = await this.typeRepo.findOne({
        where: {id: typeId},
        relations: ["categories"]
    });

    return res.json(category);
  }

  getSubCategory = async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.categoryId as string);

    const subCategory = await this.categoryRepo.findOne({
        where: {id: categoryId},
        relations: ["subCategories"]
    });

    return res.json(subCategory);
  }

  updateType = async (req: Request, res: Response) => {

    const {name} = req.body;

    const typeId = parseInt(req.params.typeId as string);

    if(!typeId){
        return res.status(404).json({success: false, error: "Type ID Not Found"});
    }

    const type = await this.typeRepo.findOneBy({
        id: typeId
    });

    if(!type){
        return res.status(404).json({success: false, error: "Type Not Found"});
    }

    type.name = name;

    await this.typeRepo.save(type);

    return res.status(200).json({success: true, message: "Type updated succesfully"});
  }

  updateCategory = async (req: Request, res: Response) => {

    const {name, typeId} = req.body;

    const categoryId = parseInt(req.params.categoryId as string);

    if(!categoryId){
        return res.status(404).json({success: false, error: "Category ID Not Found"});
    }

    const type = await this.typeRepo.findOne({
        where: {id: typeId},
        relations: ["categories"]
    });

    
    if(!type){
        return res.status(404).json({success: false, error: "Type Not Found"});
    }

    const category = type.categories.find((cat) => cat.id == categoryId);

    
    if(!category){
        return res.status(404).json({success: false, error: "Category Not Found"});
    }

    category.name = name;

    await this.categoryRepo.save(category);

    return res.status(200).json({success: true, message: "Category updated succesfully"});
  }

  updateSubCategory = async (req: Request, res: Response) => {

    const {name, categoryId} = req.body;

    const subCategoryId = parseInt(req.params.subCategoryId as string);

    if(!subCategoryId){
        return res.status(404).json({success: false, error: "Sub Category ID Not Found"});
    }

    const category = await this.categoryRepo.findOne({
        where: {id: categoryId},
        relations: ["subCategories"]
    });

    if(!category){
        return res.status(404).json({success: false, error: "Category Not Found"});
    }

    const subCategory = category.subCategories.find((sub) => sub.id == subCategoryId);

    if(!subCategory){
        return res.status(404).json({success: false, error: "Sub Category Not Found"});
    }

    subCategory.name = name;

    await this.subCategoryRepo.save(subCategory);

    return res.status(200).json({success: true, message: "Sub Category updated succesfully"});
  };


  addType = async (req: Request, res:Response) => {
    const {name} = req.body;

    const type = this.typeRepo.create({
        name
    });

    await this.typeRepo.save(type);

    return res.status(200).json({success: true, message: "Type Created Successfully"});
  }

  addCategory = async (req: Request, res:Response) => {
    const typeId = parseInt(req.params.typeId as string);
    const {name} = req.body;

    const type = await this.typeRepo.findOneBy({
        id: typeId
    });

    if(!type) {
        return res.status(404).json({success: false, error: "Type not found"});
    }

    const category = this.categoryRepo.create({
        name,
        type: type
    });

    await this.categoryRepo.save(category);

    return res.status(200).json({success: true, message: "Category Created Successfully"});
  }


  addSubCategory = async (req: Request, res:Response) => {
    const categoryId = parseInt(req.params.categoryId as string);
    const {name} = req.body;

    const category = await this.categoryRepo.findOneBy({
        id: categoryId
    });

    if(!category) {
        return res.status(404).json({success: false, error: "Category not found"});
    }

    const subCategory = this.subCategoryRepo.create({
        name,
        category: category
    });

    await this.subCategoryRepo.save(subCategory);

    return res.status(200).json({success: true, message: "Sub Category Created Successfully"});
  }


  deleteType = async (req: Request, res: Response) => {
    const typeId = parseInt(req.params.typeId as string);

    const type = await this.typeRepo.findOne({
        where: { id: typeId},
        relations: ["categories"]
    });

    console.log(type);

    const categories = type.categories;

    console.log(categories);

    if(categories.length > 0){
        return res.status(400).json({success: false, error: "Cannot delete type, may have categories"});
    }

    await this.typeRepo.delete(type.id);

    return res.status(200).json({success: true, message: "Type Deleted Successfully"})
  }

  deleteCategory = async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.categoryId as string);

    const category = await this.categoryRepo.findOne({
        where: { id: categoryId},
        relations: ["subCategories"]
    });

    const subCategories = category.subCategories;

    if(subCategories.length > 0){
        return res.status(400).json({success: false, error: "Cannot delete cateogry, may have sub categories"});
    }

    await this.categoryRepo.delete(category.id);

    return res.status(200).json({success: true, message: "Category Deleted Successfully"})
  }
  deleteSubCategory = async (req: Request, res: Response) => {
    const subCategoryId = parseInt(req.params.subCategoryId as string);

    const subCategory = await this.subCategoryRepo.findOne({
        where: { id: subCategoryId},
        relations: ["products"]
    });

    const products = subCategory.products;

    if(products.length > 0){
        return res.status(400).json({success: false, error: "Cannot delete sub category, may have products"});
    }

    await this.subCategoryRepo.delete(subCategory.id);

    return res.status(200).json({success: true, message: "Sub Category Deleted Successfully"})
  }


  getUsers = async (req: Request, res: Response) => {

    const users = await this.userRepo.find({
        where: {role: UserRole.USER}
    });

    return res.json(users);
  }

  lockUser = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if(!id){
        return res.status(400).json({success: false, error: "Id is invalid"});
    }

    const user = await this.userRepo.findOneBy({
        id
    });

    if(!user){
        return res.status(404).json({success: false, error: "User Not Found"});
    }

    user.isLocked = true;

    for(const [token, session] of sessionStore.entries()){
        if(session.id == user.id){
            sessionStore.delete(token);
            break;
        }
    }

    await this.userRepo.save(user);

    return res.status(200).json({success: true, message: "User Locked Successfully"});
  }

  unlockUser = async(req: Request, res: Response) => {
    const id = req.params.id as string;

    const user = await this.userRepo.findOneBy({
        id
    });

    if(!user){
        return res.status(404).json({success: false, error: "User Not Found"});
    }

    user.isLocked = false;

    await this.userRepo.save(user);

    return res.status(200).json({success: true, message: "User Unlocked Successfully"});
  }


  getOrders = async(req: Request, res: Response) => {
    const orders = await this.orderRepo.find({
        relations: ["orders", "orders.product"]
    });

    res.json(orders);
  }

  getOrderDetail = async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const order = await this.orderRepo.findOne({
        where: {id},
        relations: ["orders", "orders.product"]
    });

    if(!order){
        return res.status(404).json({success: false, error: "Order Not Found"});
    }

    return res.json(order);
  }

}

export const adminController = new AdminController();
