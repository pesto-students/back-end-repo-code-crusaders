const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productDetailsSchema = mongoose.Schema({
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
});

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    details: {
      type: productDetailsSchema,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    expectedDays: {
      type: String,
      enum: ['2-5', '4-8', '9-12', '13-17'],
      required: true,
    },
    customFields: [
      {
        name: {
          type: String,
          trim: true,
        },
      },
    ],
    lab: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    },
    rating: {
      type: Number,
      default: 0.0,
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
