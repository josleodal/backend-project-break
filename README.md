# Tienda de Ropa

Bienvenido/a a la aplicación de la Tienda de Ropa. Esta aplicación está diseñada para gestionar productos de moda, permitiendo a los administradores crear, editar, y eliminar productos a través de un dashboard intuitivo.

## Instalación

1. Clona este repositorio: `git clone https://github.com/josleodal/backend-project-break.git`
2. Instala las dependencias: `npm install`
3. Configura las variables de entorno en un archivo `.env`.

## Uso

- Inicia la aplicación: `npm start`
- La aplicación estará disponible en: [http://localhost:8082/products](http://localhost:8082/products)
- El dashboard de administrador está disponible en: [http://localhost:8082/dashboard](http://localhost:8082/dashboard)

## Estructura del Proyecto

- `index.js`: Punto de entrada de la aplicación.
- `routes/productRoutes.js`: Definición de las rutas relacionadas con los productos.
- `controllers/productController.js`: Lógica de controladores para gestionar productos.
- `models/Product.js`: Definición del modelo de datos para los productos.
- `config/db.js`: Configuración de la conexión a la base de datos.
-  `public`: Configuración de los archivos estáticos.

## Dependencias Principales

- [Express](https://expressjs.com/): Framework para aplicaciones web en Node.js.
- [MongoDB](https://www.mongodb.com/): Base de datos NoSQL para almacenar productos.
- [Multer](https://www.npmjs.com/package/multer): Middleware para gestionar la carga de archivos (imágenes).
- [dotenv](https://www.npmjs.com/package/dotenv): Cargar variables de entorno desde un archivo.


## Rutas

### Dashboard

- **Nuevo Producto:**
  - `GET /dashboard/new` - Muestra el formulario para añadir un nuevo producto.
  - `POST /dashboard` - Muestra los productos nuevos creados.

- **Editar Producto:**
  - `GET /dashboard/:productId/edit` - Muestra el formulario para editar un producto existente.
  - `POST /dashboard/:productId/edit` - Actualiza la información de un producto.

- **Eliminar Producto:**
  - `GET /dashboard/:productId/delete` - Eliminación de un producto.
  - `DELETE /dashboard/:productId/delete` - Elimina un producto de la base de datos.

- **Listar Productos del Dashboard:**
  - `GET /dashboard` - Muestra la lista de productos en el dashboard.

### Productos

- **Listar Todos los Productos:**
  - `GET /products` - Muestra la lista de todos los productos.

- **Ver Detalle de un Producto:**
  - `GET /products/:_id` - Muestra el detalle de un producto específico.

### Página Principal

- **Página Principal:**
  - `GET /` - Muestra la página principal.

### Dependencias Añadidas

- `path` - Se ha añadido la dependencia `path` al proyecto.

## Contribuciones

¡Contribuciones son bienvenidas! Si encuentras algún problema o tienes sugerencias, por favor abre un issue o envía un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
