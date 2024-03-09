
const express = require("express");
const router = express.Router();
const ProductController= require("../controllers/productController");
const Product = require("../models/Product");

///////////////////Función para crear un producto nuevo

const showNewProduct = (req, res) => {
   

    const emptyProduct = {
        nombre: "",
        descripcion: "",
        imagen: "", 
        precio: "",
        talla: "",
        categoria: "",
        productId: "",
    };

    const productForm = ProductController.baseHtml + ProductController.createNewProduct(emptyProduct)+ ProductController.closingHtml;
    const html =   productForm ;
    res.send(html);
};


////////////Mostrar productos

const showProducts = async (req, res) => {
    try {
        const isFromDashboard = req.path === '/dashboard';
        const currentCategory = req.query.category;
        const navBar = ProductController.getNavBar(isFromDashboard, currentCategory);

        let products;

        if (currentCategory) {
            
            products = await Product.find({ categoria: currentCategory });
        } else {
           
            products = await Product.find();
        }

        let productCards = '';

        
        if (isFromDashboard) {
            productCards =  ProductController.getProductCardsDashboard(products);
        } else {
            productCards = ProductController.getProductCards(products);
        }

        const html = ProductController.baseHtml + navBar + productCards + ProductController.closingHtml;
        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error in obtaining products", error: error.message });
    }
};

///////////////Mostras los productos por _id o ProductID

const showProductById = async (req, res) => {
    try {
        const isFromDashboard = req.path.includes('/dashboard');
        const currentCategory = req.query.category; 

        let productCard = '';

        if (isFromDashboard) {
            const product = await Product.findOne({ _id: req.params.productId });
            if (!product) {
                return res.status(404).send({ message: 'Product not found.' });
            }
            productCard =  ProductController.getProductByIdDashboard(product);
        } else {
            const product = await Product.findById(req.params._id);
            if (!product) {
                return res.status(404).send({ message: 'Product not found.' });
            }
            productCard = ProductController.getProductCardsByID(product);
        }

        const html = ProductController.baseHtml + ProductController.getNavBar(isFromDashboard, currentCategory) + productCard + ProductController.closingHtml;
        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error in obtaining products", error: error.message });
    }
};

///////////////////Rutas

  router.get('/dashboard/new', showNewProduct);
  router.post('/dashboard', ProductController.createProduct);

  router.get('/dashboard/:productId/edit', ProductController.showEditProduct);
  router.post('/dashboard/:productId/edit', ProductController.updateProduct);
  
  router.delete('/dashboard/:productId/delete', ProductController.deleteProduct);
  router.get('/dashboard/:productId/delete', ProductController.deleteProduct);

  
  router.get('/dashboard/:productId', showProductById);
  router.get('/dashboard',showProducts)
  
  
  router.get('/products', showProducts)
  router.get('/products/:_id', showProductById)












module.exports = router;


