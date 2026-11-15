import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { CustomersController } from '../src/modules/customers/customers.controller.js';
import { CustomersService } from '../src/modules/customers/customers.service.js';
import { OrdersController } from '../src/modules/orders/orders.controller.js';
import { OrdersService } from '../src/modules/orders/orders.service.js';
import { ProductsController } from '../src/modules/products/products.controller.js';
import { ProductsService } from '../src/modules/products/products.service.js';

describe('Validación HTTP de DTOs', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [ProductsController, CustomersController, OrdersController],
      providers: [
        {
          provide: ProductsService,
          useValue: { create: (body: unknown) => body },
        },
        {
          provide: CustomersService,
          useValue: { create: (body: unknown) => body },
        },
        {
          provide: OrdersService,
          useValue: { create: (body: unknown) => body },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('acepta datos válidos para los tres recursos', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Limonada',
        category: 'bebidas',
        price: 2200,
        stock: 10,
        available: true,
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/customers')
      .send({
        fullName: 'Cliente Prueba',
        phone: '11-5555-0198',
        email: 'prueba@example.com',
      })
      .expect(201);
    await request(app.getHttpServer())
      .post('/orders')
      .send({
        customerId: 1,
        deliveryType: 'RETIRO',
        items: [{ productId: 1, quantity: 2 }],
      })
      .expect(201);
  });

  it('rechaza un producto sin nombre', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({ category: 'bebidas', price: 2200, stock: 10, available: true })
      .expect(400);
  });

  it('rechaza un precio que no es numérico', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Limonada',
        category: 'bebidas',
        price: 'veinte',
        stock: 10,
      })
      .expect(400);
  });

  it('rechaza un valor de disponibilidad que no es booleano', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Limonada',
        category: 'bebidas',
        price: 2200,
        stock: 10,
        available: 'si',
      })
      .expect(400);
  });

  it('rechaza un email inválido', async () => {
    await request(app.getHttpServer())
      .post('/customers')
      .send({
        fullName: 'Cliente Prueba',
        phone: '11-5555-0198',
        email: 'no-es-un-email',
      })
      .expect(400);
  });

  it('rechaza una cantidad de pedido que no es entera', async () => {
    await request(app.getHttpServer())
      .post('/orders')
      .send({
        customerId: 1,
        deliveryType: 'RETIRO',
        items: [{ productId: 1, quantity: 'dos' }],
      })
      .expect(400);
  });
});
