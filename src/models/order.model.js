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
        address1: {
          type: String,
          required: true,
        },
        address2: {
          type: String,
        },
        landmark: {
          type: String,
        },
        city: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        country: {
          type: String,
          required: true,
        },
        pincode: {
          type: String,
          required: true,
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
      enum: ['pending', 'accepted', 'readyToShip', 'outForDelivery', 'delivered', 'rejected'],
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
