import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

class ProductController{
    private productRepo = AppDataSource.getRepository(Product);

    getAllProducts = async (req:Request, res:Response) => {
        const allProducts = await this.productRepo.find({
            relations: ["subCategory"]
        });

        return res.json(allProducts);
    }
}

export const productController = new ProductController();