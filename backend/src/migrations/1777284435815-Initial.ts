import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1777284435815 implements MigrationInterface {
    name = 'Initial1777284435815'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "type" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "typeId" integer)`);
        await queryRunner.query(`CREATE TABLE "sub_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "categoryId" integer)`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "price" decimal(10,2) NOT NULL DEFAULT (0), "stockQuantity" integer NOT NULL DEFAULT (0), "imagePath" text, "subCategoryId" integer)`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "cartId" integer, "productId" integer)`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar, CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "role" varchar CHECK( "role" IN ('user','admin') ) NOT NULL DEFAULT ('user'), "isLocked" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "typeId" integer, CONSTRAINT "FK_7aff6c4a31d9a2ec09e31d98f6f" FOREIGN KEY ("typeId") REFERENCES "type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_category"("id", "name", "typeId") SELECT "id", "name", "typeId" FROM "category"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`ALTER TABLE "temporary_category" RENAME TO "category"`);
        await queryRunner.query(`CREATE TABLE "temporary_sub_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "categoryId" integer, CONSTRAINT "FK_51b8c0b349725210c4bd8b9b7a7" FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sub_category"("id", "name", "categoryId") SELECT "id", "name", "categoryId" FROM "sub_category"`);
        await queryRunner.query(`DROP TABLE "sub_category"`);
        await queryRunner.query(`ALTER TABLE "temporary_sub_category" RENAME TO "sub_category"`);
        await queryRunner.query(`CREATE TABLE "temporary_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "price" decimal(10,2) NOT NULL DEFAULT (0), "stockQuantity" integer NOT NULL DEFAULT (0), "imagePath" text, "subCategoryId" integer, CONSTRAINT "FK_463d24f6d4905c488bd509164e6" FOREIGN KEY ("subCategoryId") REFERENCES "sub_category" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product"("id", "name", "description", "price", "stockQuantity", "imagePath", "subCategoryId") SELECT "id", "name", "description", "price", "stockQuantity", "imagePath", "subCategoryId" FROM "product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`ALTER TABLE "temporary_product" RENAME TO "product"`);
        await queryRunner.query(`CREATE TABLE "temporary_cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "cartId" integer, "productId" integer, CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cart_item"("id", "quantity", "cartId", "productId") SELECT "id", "quantity", "cartId", "productId" FROM "cart_item"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_cart_item" RENAME TO "cart_item"`);
        await queryRunner.query(`CREATE TABLE "temporary_cart" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar, CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"), CONSTRAINT "FK_756f53ab9466eb52a52619ee019" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cart"("id", "userId") SELECT "id", "userId" FROM "cart"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`ALTER TABLE "temporary_cart" RENAME TO "cart"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart" RENAME TO "temporary_cart"`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "userId" varchar, CONSTRAINT "REL_756f53ab9466eb52a52619ee01" UNIQUE ("userId"))`);
        await queryRunner.query(`INSERT INTO "cart"("id", "userId") SELECT "id", "userId" FROM "temporary_cart"`);
        await queryRunner.query(`DROP TABLE "temporary_cart"`);
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME TO "temporary_cart_item"`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "cartId" integer, "productId" integer)`);
        await queryRunner.query(`INSERT INTO "cart_item"("id", "quantity", "cartId", "productId") SELECT "id", "quantity", "cartId", "productId" FROM "temporary_cart_item"`);
        await queryRunner.query(`DROP TABLE "temporary_cart_item"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME TO "temporary_product"`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "price" decimal(10,2) NOT NULL DEFAULT (0), "stockQuantity" integer NOT NULL DEFAULT (0), "imagePath" text, "subCategoryId" integer)`);
        await queryRunner.query(`INSERT INTO "product"("id", "name", "description", "price", "stockQuantity", "imagePath", "subCategoryId") SELECT "id", "name", "description", "price", "stockQuantity", "imagePath", "subCategoryId" FROM "temporary_product"`);
        await queryRunner.query(`DROP TABLE "temporary_product"`);
        await queryRunner.query(`ALTER TABLE "sub_category" RENAME TO "temporary_sub_category"`);
        await queryRunner.query(`CREATE TABLE "sub_category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "categoryId" integer)`);
        await queryRunner.query(`INSERT INTO "sub_category"("id", "name", "categoryId") SELECT "id", "name", "categoryId" FROM "temporary_sub_category"`);
        await queryRunner.query(`DROP TABLE "temporary_sub_category"`);
        await queryRunner.query(`ALTER TABLE "category" RENAME TO "temporary_category"`);
        await queryRunner.query(`CREATE TABLE "category" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "typeId" integer)`);
        await queryRunner.query(`INSERT INTO "category"("id", "name", "typeId") SELECT "id", "name", "typeId" FROM "temporary_category"`);
        await queryRunner.query(`DROP TABLE "temporary_category"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "sub_category"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "type"`);
    }

}
