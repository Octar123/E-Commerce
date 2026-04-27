import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartItem } from "./CartItem";
import { User } from "./User";

@Entity()
export class Cart{
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, (user) => user.cart)
    @JoinColumn()
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    cartItems: CartItem[];
}