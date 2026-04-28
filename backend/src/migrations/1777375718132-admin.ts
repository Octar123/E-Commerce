import { MigrationInterface, QueryRunner } from "typeorm";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcrypt";

export class Admin1777375718132 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hashedPassword = await bcrypt.hash("123456", 10);

        const admin:Partial<User> = {
            name: "admin",
            email: "admin@example.com",
            password: hashedPassword,
            role: UserRole.ADMIN
        }

        const userRepo = AppDataSource.getRepository(User)
        userRepo.create(admin);
        await userRepo.save(admin);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
