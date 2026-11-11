import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { Customer } from './entities/customer.entity.js';
import { Order } from '../orders/entities/order.entity.js';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  create(createCustomerDto: CreateCustomerDto) {
    return this.customersRepository.save(
      this.customersRepository.create(createCustomerDto),
    );
  }

  findAll() {
    return this.customersRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const customer = await this.customersRepository.findOneBy({ id });
    if (!customer) {
      throw new NotFoundException(`No existe el cliente ${id}.`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);
    await this.customersRepository.update(id, updateCustomerDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const customer = await this.findOne(id);
    const orders = await this.ordersRepository.count({
      where: { customer: { id: customer.id } },
    });
    if (orders > 0) {
      throw new ConflictException(
        'No se puede eliminar un cliente que tiene pedidos registrados.',
      );
    }
    const result = await this.customersRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`No existe el cliente ${id}.`);
    }
    return { deleted: true };
  }
}
