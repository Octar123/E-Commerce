import typeorm from "typeorm";

export const AppDataSource = new typeorm.DataSource({
    type: "better-sqlite3",
    database: "database.db",
    synchronize: false,
    logging: true,
    entities: ["src/entity/*.ts"],
    migrations: ["src/migrations/*.ts"]
});