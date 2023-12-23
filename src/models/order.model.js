const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    productID: {
      type: mongoose.Schema.ObjectId,
    },
    doctorID: {
      type: mongoose.Schema.ObjectId,
    },
    labID: {
      type: mongoose.Schema.ObjectId,
    },
    address: {
      type: Object,
      schema: {
        addressline1: {
          type: String,
        },
        addressline2: {
          type: String,
        },
        pincode: {
          type: String,
        },
      },
    },
    orderDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
    },
    expectedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
