const express = require('express');
const dotenv = require('dotenv');
const { dbConnection } = require('./config/db');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const port = 8082;

app.use(cors());

// Middleware para el registro de solicitudes
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos en la ruta /uploads
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Middleware para servir archivos estáticos en la carpeta ../public
app.use(express.static(path.join(__dirname, '../public')));



// Rutas definidas en productRoutes
app.use('/', productRoutes);

// Conexión a la base de datos
dbConnection();

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}/products`);
});
