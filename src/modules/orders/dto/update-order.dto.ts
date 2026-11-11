import { IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity.js';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
