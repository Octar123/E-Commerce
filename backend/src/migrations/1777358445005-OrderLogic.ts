import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderLogic1777358445005 implements MigrationInterface {
    name = 'OrderLogic1777358445005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order" ("id" varchar PRIMARY KEY NOT NULL, "totalAmount" decimal(10,2) NOT NULL, "orderDate" datetime NOT NULL DEFAULT (datetime('now')), "paymentMethod" varchar CHECK( "paymentMethod" IN ('online','debit card','creadit card','cash') ) NOT NULL, "userId" varchar)`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "amountAtPurchase" decimal(10,2) NOT NULL, "orderId" varchar, "productId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_order" ("id" varchar PRIMARY KEY NOT NULL, "totalAmount" decimal(10,2) NOT NULL, "orderDate" datetime NOT NULL DEFAULT (datetime('now')), "paymentMethod" varchar CHECK( "paymentMethod" IN ('online','debit card','creadit card','cash') ) NOT NULL, "userId" varchar, CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_order"("id", "totalAmount", "orderDate", "paymentMethod", "userId") SELECT "id", "totalAmount", "orderDate", "paymentMethod", "userId" FROM "order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`);
        await queryRunner.query(`CREATE TABLE "temporary_order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "amountAtPurchase" decimal(10,2) NOT NULL, "orderId" varchar, "productId" integer, CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_order_item"("id", "quantity", "amountAtPurchase", "orderId", "productId") SELECT "id", "quantity", "amountAtPurchase", "orderId", "productId" FROM "order_item"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`ALTER TABLE "temporary_order_item" RENAME TO "order_item"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" RENAME TO "temporary_order_item"`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL, "amountAtPurchase" decimal(10,2) NOT NULL, "orderId" varchar, "productId" integer)`);
        await queryRunner.query(`INSERT INTO "order_item"("id", "quantity", "amountAtPurchase", "orderId", "productId") SELECT "id", "quantity", "amountAtPurchase", "orderId", "productId" FROM "temporary_order_item"`);
        await queryRunner.query(`DROP TABLE "temporary_order_item"`);
        await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`);
        await queryRunner.query(`CREATE TABLE "order" ("id" varchar PRIMARY KEY NOT NULL, "totalAmount" decimal(10,2) NOT NULL, "orderDate" datetime NOT NULL DEFAULT (datetime('now')), "paymentMethod" varchar CHECK( "paymentMethod" IN ('online','debit card','creadit card','cash') ) NOT NULL, "userId" varchar)`);
        await queryRunner.query(`INSERT INTO "order"("id", "totalAmount", "orderDate", "paymentMethod", "userId") SELECT "id", "totalAmount", "orderDate", "paymentMethod", "userId" FROM "temporary_order"`);
        await queryRunner.query(`DROP TABLE "temporary_order"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TABLE "order"`);
    }

}
