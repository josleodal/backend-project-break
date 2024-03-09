const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imagen: {
    type: String, 
    default: "default.jpg", 
  },
  categoria: {
    type: String,
    required: true,
    enum: ["Camisetas", "Pantalones", "Zapatos", "Accesorios"],
  },
  talla: {
    type: String,
    required: true,
    enum: ["XS", "S", "M", "L", "XL"],
  },
  precio: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    default: function () {
      // Utiliza el _id generado automáticamente por MongoDB como valor predeterminado
      return this._id.toHexString();
    },
  },
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
