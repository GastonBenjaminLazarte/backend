import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Customer } from '../customers/entities/customer.entity.js';
import { Product } from '../products/entities/product.entity.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { Order, DeliveryType } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return this.dataSource.transaction(async (manager) => {
      const customer = await manager
        .getRepository(Customer)
        .findOneBy({ id: createOrderDto.customerId });
      if (!customer) {
        throw new NotFoundException(
          `No existe el cliente ${createOrderDto.customerId}.`,
        );
      }

      if (
        createOrderDto.deliveryType === DeliveryType.HOME &&
        !createOrderDto.address?.trim()
      ) {
        throw new BadRequestException(
          'La dirección es obligatoria para los pedidos a domicilio.',
        );
      }

      const quantities = new Map<number, number>();
      for (const item of createOrderDto.items) {
        quantities.set(
          item.productId,
          (quantities.get(item.productId) ?? 0) + item.quantity,
        );
      }

      const items: OrderItem[] = [];
      let totalInCents = 0;
      for (const [productId, quantity] of quantities) {
        const product = await manager.getRepository(Product).findOne({
          where: { id: productId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!product || !product.available) {
          throw new NotFoundException(
            `El producto ${productId} no existe o no está disponible.`,
          );
        }
        if (product.stock < quantity) {
          throw new ConflictException(
            `Stock insuficiente para ${product.name}. Disponible: ${product.stock}.`,
          );
        }

        product.stock -= quantity;
        if (product.stock === 0) product.available = false;
        await manager.getRepository(Product).save(product);

        const unitPrice = Number(product.price);
        totalInCents += Math.round(unitPrice * 100) * quantity;
        items.push(
          manager.getRepository(OrderItem).create({
            product,
            quantity,
            unitPrice: product.price,
          }),
        );
      }

      const order = manager.getRepository(Order).create({
        customer,
        deliveryType: createOrderDto.deliveryType,
        address: createOrderDto.address?.trim() || null,
        total: (totalInCents / 100).toFixed(2),
        items,
      });
      return manager.getRepository(Order).save(order);
    });
  }

  findAll() {
    return this.ordersRepository.find({
      relations: { customer: true, items: { product: true } },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { customer: true, items: { product: true } },
    });
    if (!order) throw new NotFoundException(`No existe el pedido ${id}.`);
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);
    await this.ordersRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.ordersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`No existe el pedido ${id}.`);
    }
    return { deleted: true };
  }
}
