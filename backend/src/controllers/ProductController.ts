import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { Type } from "../entities/Type";

class ProductController{
    private productRepo = AppDataSource.getRepository(Product);
    private typeRepo = AppDataSource.getRepository(Type);

    getAllProducts = async (req:Request, res:Response) => {
        const allProducts = await this.productRepo.find({
            relations: ["subCategory"]
        });

        return res.json(allProducts);
    }

    getTaxonomy = async (req: Request, res: Response) => {
        const taxonomy = await this.typeRepo.find({
            relations: ["categories", "categories.subCategories", "categories.subCategories.products"]
        });

        res.json(taxonomy);
    }
}

export const productController = new ProductController();