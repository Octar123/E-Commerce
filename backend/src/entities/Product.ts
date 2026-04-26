import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubCategory } from "./SubCateory";

@Entity()
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text"})
    name: string;

    @Column({type: "text"})
    description: string;

    @Column({type: "decimal", precision: 10, scale: 2, default: 0.00})
    price: number;

    @Column({type: "integer", default: 0})
    stockQuantity: number;

    @Column({type: "text", nullable: true})
    imagePath: string;

    @ManyToOne(() => SubCategory, (subCateroy) => subCateroy.products)
    subCategory: SubCategory;
}