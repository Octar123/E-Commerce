import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateItem1777289434148 implements MigrationInterface {
    name = 'UpdateItem1777289434148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "cartId" integer, "productId" integer, CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cart_item"("id", "quantity", "cartId", "productId") SELECT "id", "quantity", "cartId", "productId" FROM "cart_item"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_cart_item" RENAME TO "cart_item"`);
        await queryRunner.query(`CREATE TABLE "temporary_cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "cartId" integer, "productId" integer, CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_cart_item"("id", "quantity", "cartId", "productId") SELECT "id", "quantity", "cartId", "productId" FROM "cart_item"`);
        await queryRunner.query(`DROP TABLE "cart_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_cart_item" RENAME TO "cart_item"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME TO "temporary_cart_item"`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "cartId" integer, "productId" integer, CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "cart_item"("id", "quantity", "cartId", "productId") SELECT "id", "quantity", "cartId", "productId" FROM "temporary_cart_item"`);
        await queryRunner.query(`DROP TABLE "temporary_cart_item"`);
        await queryRunner.query(`ALTER TABLE "cart_item" RENAME TO "temporary_cart_item"`);
        await queryRunner.query(`CREATE TABLE "cart_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "cartId" integer, "productId" integer, CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "cart_item"("id", "quantity", "cartId", "productId") SELECT "id", "quantity", "cartId", "productId" FROM "temporary_cart_item"`);
        await queryRunner.query(`DROP TABLE "temporary_cart_item"`);
    }

}
