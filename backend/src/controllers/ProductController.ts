import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";
import { Type } from "../entities/Type";
// import { CartItem } from "../entities/CartItem";
// import { User } from "../entities/User";
// import { Cart } from "../entities/Cart";

class ProductController {
  private productRepo = AppDataSource.getRepository(Product);
  private typeRepo = AppDataSource.getRepository(Type);

  // getAllProducts = async (req: Request, res: Response) => {
  //   const page = Math.max(1, parseInt(req.body.page) || 1);
  //   const pageSize = 9;

  //   const skip = (page - 1) * pageSize;

  //   const dbQuery = this.productRepo
  //     .createQueryBuilder("product")
  //     .leftJoinAndSelect("product.subCategory", "subCategory")
  //     .skip(skip)
  //     .take(pageSize);

  //   const [products, totalItems] = await dbQuery.getManyAndCount();

  //   const lastPage = Math.ceil(totalItems / pageSize);

  //   return res.json({
  //     data: products,
  //     metadata: {
  //       totalItems,
  //       lastPage,
  //       currentPage: page,
  //     },
  //   });
  // };

  getTaxonomy = async (req: Request, res: Response) => {
    const taxonomy = await this.typeRepo.find({
      relations: [
        "categories",
        "categories.subCategories",
        "categories.subCategories.products",
      ],
    });

    res.json({types: taxonomy});
  };

  searchProducts = async (req: Request, res: Response) => {
    try {
      const { search, subCategoryId, categoryId, typeId, minPrice, maxPrice } =
        req.query;

      const page = Number(req.query.page) || 1;
      const pageSize =9;
      const skip = (page - 1) * pageSize;

      const dbQuery = this.productRepo
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.subCategory", "subCategory")
        .leftJoinAndSelect("subCategory.category", "category")
        .leftJoinAndSelect("category.type", "type");

      if (search) {
        dbQuery.andWhere(
          "(product.name LIKE :search OR product.description LIKE :search)",
          { search: `%${search}%` },
        );
      }

      if (subCategoryId) {
        dbQuery.andWhere("subCategory.id == :subId", { subId: subCategoryId });
      }
      if (categoryId) {
        dbQuery.andWhere("category.id == :catId", { catId: categoryId });
      }
      if (typeId) {
        dbQuery.andWhere("type.id == :typeId", { typeId: typeId });
      }

      if (minPrice) {
        dbQuery.andWhere("product.price >= :min", { min: minPrice });
      }

      if (maxPrice) {
        dbQuery.andWhere("product.price <= :max", { max: maxPrice });
      }

      dbQuery.andWhere("product.stockQuantity > 0");

      dbQuery.skip(skip).take(pageSize);

      const [products, totalItems] = await dbQuery.getManyAndCount();

    const lastPage = Math.ceil(totalItems / pageSize);

      res.json({
        data: products,
        metadata: {
          totalItems,
          lastPage,
          currentPage: page,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error Occured while searching" });
    }
  };

  getSingleProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!id) {
      res.status(400).json({ success: false, error: "Invalid Product" });
    }

    const product = await this.productRepo.findOne({
      where: { id },
      relations: [
        "subCategory",
        "subCategory.category",
        "subCategory.category",
        "subCategory.category.type",
      ],
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "No Products Found" });
    }
    return res.json({product});
  };
}

export const productController = new ProductController();
