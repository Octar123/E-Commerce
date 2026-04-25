import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Type } from "./Type";
import { SubCategory } from "./SubCateory";

@Entity()
export class Category{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "text"})
    name: string;

    @ManyToOne(() => Type, (type) => type.categories)
    type: Type;

    @OneToMany(() => SubCategory, (subCategory) => subCategory.category)
    subCategories: SubCategory[];
}