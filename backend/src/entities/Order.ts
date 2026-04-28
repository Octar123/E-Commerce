import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

export enum paymentMethods{
    ONLINE="online",
    DEBIT="debit card",
    CREDIT="creadit card",
    CASH="cash"
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({type: "decimal", precision: 10, scale: 2})
    totalAmount: number;

    @CreateDateColumn()
    orderDate: Date;

    @Column({type: "simple-enum", enum: paymentMethods})
    paymentMethod: paymentMethods;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orders: OrderItem[];
}