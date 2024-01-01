const mongoose = require('mongoose');
// const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    lab: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
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
      enum: ['pending', 'accepted', 'readyToShip', 'outForDelivery', 'delivered'],
      required: true,
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
