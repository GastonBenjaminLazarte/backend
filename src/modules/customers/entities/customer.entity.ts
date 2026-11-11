import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity.js';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', length: 120 })
  fullName: string;

  @Column({ length: 30, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 160, nullable: true, unique: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];
}
