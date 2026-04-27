import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "integer", default: 1})
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.cartItems)
    cart: Cart;

    @ManyToOne(() => Product, (product) => product.cartItems)
    product: Product;
}