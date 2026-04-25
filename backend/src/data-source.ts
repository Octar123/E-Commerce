import "reflect-metadata"
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME;
export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: dbName || "database.db",
    synchronize: false,
    logging: true,
    entities: ["src/entities/*.ts"],
    migrations: ["src/migrations/*.ts"]
});