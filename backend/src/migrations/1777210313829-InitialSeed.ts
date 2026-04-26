import { MigrationInterface, QueryRunner } from "typeorm";
import { AppDataSource } from "../data-source";
import { Type } from "../entities/Type";
import { Category } from "../entities/Category";
import { SubCategory } from "../entities/SubCateory";
import { Product } from "../entities/Product";

export class InitialSeed1777210313829 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        const typeRepo = AppDataSource.getRepository(Type);
        const categoryRepo = AppDataSource.getRepository(Category);
        const subCategoryRepo = AppDataSource.getRepository(SubCategory);
        const productRepo = AppDataSource.getRepository(Product);

        const electroinsType = typeRepo.create({name: 'Electronics'});
        await typeRepo.save(electroinsType);

        const computingCategory = categoryRepo.create({name: 'Computings', type: electroinsType});
        await categoryRepo.save(computingCategory);

        const laptopSubCategory = subCategoryRepo.create({name: 'Laptops', category: computingCategory});
        await subCategoryRepo.save(laptopSubCategory);

        const macBook = productRepo.create({
            name: 'MacBook Pro',
            description: 'M3 Chip, 16GB RAM',
            price: 1999.9,
            stockQuantity: 15,
            subCategory: laptopSubCategory
        });
        const victus = productRepo.create({
            name: 'Victus',
            description: 'ryzen, 16GB RAM',
            price: 999.9,
            stockQuantity: 10,
            subCategory: laptopSubCategory
        });

        await productRepo.save(macBook);
        await productRepo.save(victus);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
