import { MigrationInterface, QueryRunner } from "typeorm";
import { Type } from "../entities/Type";
import { Category } from "../entities/Category";
import { SubCategory } from "../entities/SubCateory";
import { Product } from "../entities/Product";

export class InitialSeed1777285419764 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const manager = queryRunner.manager;
        
            const electronicsType = await manager.save(
              manager.create(Type, { name: "Electronics" }),
            );
        
            const computingCategory = await manager.save(
              manager.create(Category, { name: "Computing", type: electronicsType }),
            );
        
            const laptopSubCategory = await manager.save(
              manager.create(SubCategory, {
                name: "Laptops",
                category: computingCategory,
              }),
            );
        
            // Bulk save products for better performance
            await manager.save(Product, [
              {
                name: "MacBook Pro",
                description: "M3 Chip, 16GB RAM",
                price: 1999.9,
                stockQuantity: 15,
                subCategory: laptopSubCategory,
              },
              {
                name: "Victus",
                description: "ryzen, 16GB RAM",
                price: 999.9,
                stockQuantity: 10,
                subCategory: laptopSubCategory,
              },
            ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
