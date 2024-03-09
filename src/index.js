// index.js
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
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});


app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../public')));




app.use(express.json()); 
app.use('/', productRoutes); 

dbConnection();

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}/products`);
});


