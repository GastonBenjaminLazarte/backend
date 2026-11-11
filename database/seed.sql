INSERT INTO products (id, name, category, description, price, stock, available, image) VALUES
  (1, 'Hamburguesa completa', 'hamburguesas', 'Carne, queso, tomate, lechuga y salsa casera.', 5500, 18, true, '/img/hamburguesa-completa.jpg'),
  (2, 'Pizza muzzarella', 'pizzas', 'Pizza clásica con salsa, muzzarella y albahaca.', 7000, 12, true, '/img/pizza-muzzarella.jpg'),
  (3, 'Ensalada de estación', 'frescos', 'Mix de hojas frescas, tomate, cebolla y aderezo.', 4800, 3, true, '/img/ensalada-estacion.jpg'),
  (4, 'Limonada casera', 'bebidas', 'Bebida fresca natural con limón.', 1800, 20, true, '/img/limonada-casera.jpg'),
  (5, 'Papas fritas', 'frescos', 'Porción crocante para acompañar.', 2600, 14, true, '/img/papas-fritas.jpg'),
  (6, 'Milanesa con papas', 'hamburguesas', 'Plato completo con papas y guarnición.', 6300, 8, true, '/img/milanesa-con-papas.jpg');

INSERT INTO customers (id, full_name, phone, email, address) VALUES
  (1, 'Ana García', '11-5555-0101', 'ana@example.com', 'Av. San Martín 120'),
  (2, 'Bruno López', '11-5555-0102', 'bruno@example.com', 'Belgrano 245'),
  (3, 'Carla Díaz', '11-5555-0103', 'carla@example.com', 'Mitre 358'),
  (4, 'Diego Pérez', '11-5555-0104', 'diego@example.com', 'Rivadavia 462'),
  (5, 'Elena Ruiz', '11-5555-0105', 'elena@example.com', 'Sarmiento 574');

INSERT INTO orders (id, customer_id, status, delivery_type, address, total) VALUES
  (1, 1, 'NUEVO', 'RETIRO', NULL, 5500),
  (2, 2, 'CONFIRMADO', 'DOMICILIO', 'Belgrano 245', 7000),
  (3, 3, 'EN PREPARACION', 'RETIRO', NULL, 4400),
  (4, 4, 'LISTO', 'DOMICILIO', 'Rivadavia 462', 4800),
  (5, 5, 'ENTREGADO', 'RETIRO', NULL, 8900);

INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES
  (1, 1, 1, 1, 5500),
  (2, 2, 2, 1, 7000),
  (3, 3, 4, 1, 1800),
  (4, 3, 5, 1, 2600),
  (6, 4, 3, 1, 4800),
  (7, 5, 5, 1, 2600),
  (8, 5, 6, 1, 6300);

SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products));
SELECT setval(pg_get_serial_sequence('customers', 'id'), (SELECT MAX(id) FROM customers));
SELECT setval(pg_get_serial_sequence('orders', 'id'), (SELECT MAX(id) FROM orders));
SELECT setval(pg_get_serial_sequence('order_items', 'id'), (SELECT MAX(id) FROM order_items));
