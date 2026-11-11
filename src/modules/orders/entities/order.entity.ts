import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity.js';
import { OrderItem } from './order-item.entity.js';

export enum OrderStatus {
  NEW = 'NUEVO',
  CONFIRMED = 'CONFIRMADO',
  PREPARING = 'EN PREPARACION',
  READY = 'LISTO',
  IN_DELIVERY = 'EN CAMINO',
  DELIVERED = 'ENTREGADO',
}

export enum DeliveryType {
  PICKUP = 'RETIRO',
  HOME = 'DOMICILIO',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    enumName: 'order_status',
    default: OrderStatus.NEW,
  })
  status: OrderStatus;

  @Column({
    name: 'delivery_type',
    type: 'enum',
    enum: DeliveryType,
    enumName: 'delivery_type',
  })
  deliveryType: DeliveryType;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  total: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
