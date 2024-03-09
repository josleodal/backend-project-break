
const Product = require("../models/Product");
const multer = require('multer'); //Necesario para guardar imagenes
const path = require('path');

///////////Nos sirve para guardarlas las imagenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Mantén la carpeta public si es necesario
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});


  
  const upload = multer({ storage: storage });

//////////////Base Html/////////////////////////7
  const baseHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" type="text/css" href="/styles.css">
        <title>Tu Aplicación</title>
    </head>
    <body>
    <h1>Tienda de Ropa</h1>
`;


////////////////////Cierre Html///////////////////////7
const closingHtml = `
    </body>
    </html>
`;


/////////////////Barra de Navegación///////////////////////////

const getNavBar = (isDashboard, currentCategory) => {
    const categories = ["Camisetas", "Pantalones", "Zapatos", "Accesorios"];

    let navBarHtml = `
        <nav>
            <ul>
                <li><a href="/${isDashboard ? 'dashboard' : 'products'}">Todos</a></li>
    `;

    for (const category of categories) {
        const categoryUrl = isDashboard ? `/dashboard?category=${category}` : `/products?category=${category}`;
        const isActive = currentCategory === category ? 'active' : '';

        navBarHtml += `<li class="${isActive}"><a href="${categoryUrl}">${category}</a></li>`;
    }

    if (isDashboard) {
        navBarHtml += `
            <li><a href="/dashboard/new">Subir Nuevo Producto</a></li>
            <li><a href="/products">Ver Productos</a></li>
        `;
    } else {
        navBarHtml += `<li><a href="/dashboard">Dashboard</a></li>`;
    }

    navBarHtml += `
            </ul>
        </nav>
    `;

    return navBarHtml;
};




//*GET /products: Devuelve todos los productos. Cada producto tendrá un enlace a su página de detalle.
function getProductCards(products) {
    let html = '';
    for (let product of products) {
    
//console.log(product.imagen.replace(/\\/g, '/'))

        html += `
            <div class="product-card">
                <img src="/uploads/${product.imagen.replace(/\\/g, '/')}" alt="${product.nombre}">
                <h2>${product.nombre}</h2>
                <p>${product.descripcion}</p>
                <p>${product.precio}€</p>
                <p>${product.categoria}</p>
                <p>Talla: ${product.talla}</p>
                <a href="/products/${product._id}">Ver detalle</a>
            </div>
        `;
    }
    return html;
}

  
  

//*GET /products/:productId: Devuelve el detalle de un producto./

const getProductCardsByID = (product) => {
 
    let html = '';
    html = `
        <div class="product-card">
            <img src="/uploads/${product.imagen.replace(/\\/g, '/')}" alt="${product.nombre}">
            <h2>${product.nombre}</h2>
            <p>${product.descripcion}</p>
            <p>${product.precio}€</p>
            <p>${product.categoria}</p>
            <p>Talla: ${product.talla}</p>
        </div>
    `;

    return html;
};


/** GET /dashboard/new: Devuelve el formulario para subir un artículo nuevo. HAY QUE HACERLOS */



const createNewProduct = (product) => {
    let html = ` 
    <form action="/dashboard" method="post" enctype="multipart/form-data">

            <ul>
                <li>
                    <label for="imagen">Imagen:</label>
                    <input type="file" id="imagen" name="imagen" accept="image/*">
                </li>
                <li>
                    <label for="name">Nombre:</label>
                    <input type="text" id="name" name="nombre" value="${product.nombre}" />
                </li>
                <li>
                    <label for="descripcion">Descripción:</label>
                    <input type="text" id="descripcion" name="descripcion" value="${product.descripcion}" />
                </li>
                <li>
                    <label for="precio">Precio:</label>
                    <input type="text" id="precio" name="precio" value="${product.precio}" />
                </li>
                <li>
                        <label for="talla">Talla:</label>
                        <select id="talla" name="talla">
                        <option value="XS">XS</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                        </select>
                </li>
                <li>
                        <label for="categoria">Categoría:</label>
                        <select id="categoria" name="categoria">
                        <option value="Camisetas">Camisetas</option>
                        <option value="Pantalones">Pantalones</option>
                        <option value="Zapatos">Zapatos</option>
                        <option value="Accesorios">Accesorios</option>
                        </select>
                </li>
            </ul>
            <button type="submit">Crear Producto</button>
        </form> `;

    return html;
};

/*GET /dashboard: Devuelve el dashboard del administrador. En el dashboard aparecerán todos los artículos que se hayan subido. 
Si clickamos en uno de ellos nos llevará a su página para poder actualizarlo o eliminarlo.*/


function getProductCardsDashboard(products) {
    let html = '';
    for (let product of products) {
      html += `
        <div class="product-card">
        <img src="/uploads/${product.imagen.replace(/\\/g, '/')}" alt="${product.nombre}">
          <h2>${product.nombre}</h2>
          <p>${product.descripcion}</p>
          <p>${product.precio}€</p>
          <p>${product.categoria}</p>
          <p>Talla: ${product.talla}</p>
          <a href="/dashboard/${product.productId}">Ver detalle</a>
        </div>
      `;
    }
    return html;
  }


/*POST /dashboard: Crea un nuevo producto. REVISAR SI HAY QUE MODIFICAR*/ 


const createProduct = async (req, res) => {
    try {
        // Procesar la carga de archivos
        upload.single('imagen')(req, res, async function (err) {
            if (err) {
                return res.status(500).send({ message: 'Error al cargar la imagen', error: err.message });
            }

            try {
               
                const imagePath = req.file ? path.relative(__dirname, req.file.path) : '';
                const product = await Product.create({ ...req.body, imagen: req.file ? req.file.filename.replace('public/', '') : '' });

                res.redirect(`/dashboard`);
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "There was a problem trying to create a Product", error: error.message });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "There was a problem trying to create a Product", error: error.message });
    }
};



/*GET /dashboard/:productId: Devuelve el detalle de un producto en el dashboard. */

const getProductByIdDashboard = (product) => {
    let html = '';
    html = `
    <div class="product-card">
    <img src="/uploads/${product.imagen.replace(/\\/g, '/')}" alt="${product.nombre}">
        <h2>${product.nombre}</h2>
        <p>${product.descripcion}</p>
        <p>${product.precio}€</p>
        <p>${product.categoria}</p>
        <p>Talla: ${product.talla}</p>
        <a href="/dashboard/${product.productId}/edit">Actualizar</a>
        <a href="/dashboard/${product.productId}/delete">Eliminar</a>
    </div>`;


    ;
    return html;
};


/** PUT /dashboard/:productId: Actualiza un producto.*/



const updateProduct = async (req, res) => {
    try {
        // Procesar la carga de archivos
        upload.single('imagen')(req, res, async function (err) {
            if (err) {
                return res.status(500).send({ message: 'Error al cargar la imagen', error: err.message });
            }

            try {
             
                const existingProduct = await Product.findById(req.params.productId);

                if (!existingProduct) {
                    return res.status(404).send({ message: 'Producto no encontrado.' });
                }

                // Actualiza los campos del producto con la información del cuerpo de la solicitud
                existingProduct.nombre = req.body.nombre;
                existingProduct.descripcion = req.body.descripcion;
                existingProduct.precio = req.body.precio;
                existingProduct.talla = req.body.talla;
                existingProduct.categoria = req.body.categoria;

                // Actualizar la imagen solo si se proporciona un nuevo archivo
                if (req.file) {
                    existingProduct.imagen = req.file.filename.replace('public/', '');
                }

                // Guardar los cambios y obtener el producto actualizado
                const updatedProduct = await existingProduct.save();

                // Redirigir a la vista de detalle del producto actualizado
                res.redirect(`/dashboard`);
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "There was a problem updating the product", error: error.message });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "There was a problem updating the product", error: error.message });
    }
};

/////////////////////Formulario para actulizar producto

const updateEditProduct = (product) => {
    let html = '';
    html = `${baseHtml}<form action="/dashboard/${product.productId}/edit" method="POST" enctype="multipart/form-data">
    <input type="hidden" name="_method" value="PUT">

                <ul>
                    <li>
                        <label for="imagen">Imagen:</label>
                        <input type="file" id="imagen" name="imagen" accept="image/*">
                    </li>
                    ${product.imagen ? `<li><img src="/uploads/${product.imagen}" alt="Imagen actual"></li>` : ''}
                    <li>
                        <label for="name">Nombre:</label>
                        <input type="text" id="name" name="nombre" value="${product.nombre}" />
                    </li>
                    <li>
                        <label for="descripcion">Descripción:</label>
                        <input type="text" id="descripcion" name="descripcion" value="${product.descripcion}" />
                    </li>
                    <li>
                        <label for="precio">Precio:</label>
                        <input type="text" id="precio" name="precio" value="${product.precio}" />
                    </li>
                    <li>
                    <label for="talla">Talla:</label>
                    <select id="talla" name="talla">
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    </select>
            </li>
            <li>
                    <label for="categoria">Categoría:</label>
                    <select id="categoria" name="categoria">
                    <option value="Camisetas">Camisetas</option>
                    <option value="Pantalones">Pantalones</option>
                    <option value="Zapatos">Zapatos</option>
                    <option value="Accesorios">Accesorios</option>
                    </select>
            </li>
        </ul>
                </ul>
                <button type="submit">Actualizar Producto</button>
            </form>
            ${closingHtml}`;
    
    return html;
};

///////////////////////Mostrar formulario

const showEditProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.productId });

        if (!product) {
            res.status(404).send({ message: 'Producto no encontrado.' });
            return;
        }

        console.log('Show Edit Product Controller:', product);
        const productForm = updateEditProduct(product);
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.send(productForm);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Problema con el formulario", error: error.message });
    }
};



/*DELETE /dashboard/:productId/delete: Elimina un producto. */

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: req.params.productId });

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.redirect(`/dashboard`)
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Problem deleting", error: error.message });
    }
};








module.exports = { getProductCards, getProductCardsByID, createProduct, createNewProduct, getProductByIdDashboard, updateProduct,
    updateEditProduct, showEditProduct, deleteProduct,getProductCardsDashboard, baseHtml, closingHtml, upload,getNavBar };


