import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid") // for unique id for each user
    id: string;

    @Column({type:"text"})
    name: string;

    @Column({type: "text",unique: true})
    email: string;

    @Column({type: "text", select: false})
    password: string;

    @Column({type: "simple-enum", enum: UserRole, default: UserRole.USER})
    role: UserRole;

    @Column({type: "boolean", default: false})
    isLocked: boolean;

    @OneToOne(() => Cart, (cart) => cart.user)
    cart: Cart;
}