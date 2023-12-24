const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
    },
    productDetails: {
      type: Object,
      schema: {
        metal: {
          type: String,
        },
        features: {
          type: String,
        },
        specifications: {
          type: String,
        },
        materialComposition: {
          type: String,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
