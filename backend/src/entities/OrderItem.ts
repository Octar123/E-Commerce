import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "integer"})
    quantity: number;

    @Column({type: "decimal", precision: 10, scale: 2})
    amountAtPurchase: number;

    @ManyToOne(() => Order, (order) => order.orders)
    order:Order;

    @ManyToOne(() => Product, (product) => product.orderItems)
    product:Product;
}