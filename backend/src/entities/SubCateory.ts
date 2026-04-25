import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";
import { Product } from "./Product";

@Entity()
export class SubCategory{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text"})
    name: string;

    @ManyToOne(() => Category, (category) => category.subCategories)
    category: Category;

    @OneToMany(() => Product, (product) => product.subCategory)
    products: Product[];
}