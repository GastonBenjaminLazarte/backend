# Comanda API

API REST para la gestión de productos, clientes y pedidos del sistema COMANDA. Está desarrollada con NestJS, TypeORM y PostgreSQL.

## Funcionalidades

- CRUD de productos y control de disponibilidad y stock.
- CRUD de clientes.
- Creación y consulta de pedidos con sus ítems.
- Validación de datos y relaciones entre clientes, pedidos y productos.
- Descuento de stock al crear un pedido, dentro de una transacción.
- Colección de Postman para recorrer los endpoints.

## Requisitos

- Node.js 20 o superior y npm.
- PostgreSQL 14 o superior.

## Puesta en marcha

1. Cloná el repositorio e instalá las dependencias:

   ```bash
   git clone https://github.com/GastonBenjaminLazarte/backend.git
   cd backend
   npm install
   ```

2. Creá una base de datos PostgreSQL llamada `comanda`.
3. Copiá `.env.example` a `.env` y ajustá los valores para tu entorno:

   ```env
   PORT=4000
   DATABASE_URL=postgresql://usuario:password@localhost:5432/comanda
   API_BASE_URL=http://localhost:4000/
   DB_SYNCHRONIZE=false
   ```

4. Creá las tablas e insertá los datos de ejemplo:

   ```bash
   psql "postgresql://usuario:password@localhost:5432/comanda" -f database/schema.sql
   psql "postgresql://usuario:password@localhost:5432/comanda" -f database/seed.sql
   ```

   Los scripts se ejecutan una vez sobre una base vacía. El archivo `seed.sql` incluye cinco o más registros por tabla.

5. Iniciá la API en modo desarrollo:

   ```bash
   npm run start:dev
   ```

La API escucha en `http://localhost:4000` por defecto. La ruta `GET /` permite comprobar que está activa. Usá `DB_SYNCHRONIZE=false` cuando las tablas se administren mediante los scripts SQL.

## Configuración

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto HTTP de la API; por defecto, `4000`. |
| `DATABASE_URL` | URL de conexión a PostgreSQL. |
| `API_BASE_URL` | URL base de la API para clientes y documentación. |
| `DB_SYNCHRONIZE` | Activa la sincronización automática de TypeORM; usar `false` con el esquema SQL. |

El archivo `.env` contiene configuración local y no debe compartirse ni subirse al repositorio. `.env.example` sirve como plantilla.

## Módulos y endpoints

Los módulos se encuentran en `src/modules/` y se registran desde `src/modules/app/app.module.ts`.

| Recurso | Rutas |
| --- | --- |
| Estado de la API | `GET /` |
| Productos | `GET /products`, `GET /products/:id`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id` |
| Clientes | `GET /customers`, `GET /customers/:id`, `POST /customers`, `PATCH /customers/:id`, `DELETE /customers/:id` |
| Pedidos | `GET /orders`, `GET /orders/:id`, `POST /orders`, `PATCH /orders/:id`, `DELETE /orders/:id` |

Las solicitudes se validan; los campos no permitidos se rechazan. Para modificar el estado de un pedido, por ejemplo:

```http
PATCH /orders/1
Content-Type: application/json
```

```json
{ "status": "EN PREPARACION" }
```

Para crear un pedido:

```http
POST /orders
Content-Type: application/json
```

```json
{
  "customerId": 1,
  "deliveryType": "RETIRO",
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 4, "quantity": 1 }
  ]
}
```

El tipo de entrega a domicilio requiere una dirección. Los productos asociados a pedidos y los clientes con pedidos no se pueden eliminar, para proteger las relaciones de la base de datos.

## Base de datos

`database/schema.sql` crea `products`, `customers`, `orders` y `order_items`, con claves primarias y foráneas, restricciones y tipos adecuados. `database/seed.sql` carga datos de ejemplo y ajusta las secuencias de IDs. Los ítems guardan el precio unitario al momento de la compra.

## Postman

Importá `postman/comanda-api.postman_collection.json` en Postman. La colección incluye solicitudes para consultar, crear, actualizar y eliminar productos, clientes y pedidos. La variable `baseUrl` usa `http://localhost:4000` por defecto. Para probar pedidos, cargá primero el esquema y los datos de ejemplo.

Para comprobar el TP 10, iniciá la API con `npm run start:dev` e importá la colección. En la carpeta **Validación de DTOs (esperan HTTP 400)** ejecutá las solicitudes inválidas: omiten el nombre del producto, envían texto en el precio o cantidad, usan un valor no booleano en `available` y un email inválido. Cada una incluye una comprobación de respuesta HTTP 400. Las solicitudes válidas de creación de producto, cliente y pedido están en sus respectivas carpetas. También podés correr `npm run test:e2e`: incluye pruebas HTTP de DTOs que no requieren PostgreSQL.

## Comandos útiles

```bash
npm run start:dev  # iniciar en desarrollo
npm run build      # compilar
npm test           # ejecutar pruebas unitarias
npm run test:e2e   # ejecutar pruebas end-to-end
npm run lint       # revisar el código
```

## Estructura del proyecto

```text
src/
├── main.ts
└── modules/
    ├── app/
    ├── customers/
    ├── orders/
    └── products/
database/
├── schema.sql
└── seed.sql
postman/
└── comanda-api.postman_collection.json
```

## Trabajo en equipo

La estrategia propuesta para el equipo es mantener `main` estable, integrar el desarrollo en `dev` y crear ramas por tarea, por ejemplo `feature/nombre-funcionalidad`, `fix/nombre-correccion`, `refactor/nombre-cambio` o `docs/nombre-documentacion`. Abran Pull Requests descriptivos hacia `dev` y pasen los cambios probados a `main`. Agreguen a los integrantes como colaboradores desde la configuración del repositorio.
