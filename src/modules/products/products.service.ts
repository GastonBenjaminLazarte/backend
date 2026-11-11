import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Product } from './entities/product.entity.js';
import { OrderItem } from '../orders/entities/order-item.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(
      Object.assign({}, createProductDto, {
        price: createProductDto.price.toFixed(2),
      }),
    );
    return this.productsRepository.save(product);
  }

  findAll() {
    return this.productsRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`No existe el producto ${id}.`);
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    if (updateProductDto.price !== undefined) {
      product.price = updateProductDto.price.toFixed(2);
    }
    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const referencedItems = await this.orderItemsRepository.count({
      where: { product: { id } },
    });
    if (referencedItems > 0) {
      throw new ConflictException(
        'No se puede eliminar un producto incluido en pedidos.',
      );
    }
    const result = await this.productsRepository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`No existe el producto ${id}.`);
    }
    return { deleted: true };
  }
}
